import { orderBy } from 'lodash-es'
import type {
  ConditionOperator,
  IForm,
  IFormAggregated,
  IFormComponent,
  IFormQuestion,
  IFormSection,
  InfoCardContentBlock,
  RadioCardItem,
} from '../models/form'
import {
  ComponentType,
  QuestionType,
} from '../models/form'

// types.ts (inline or import where you build the schema)
type JSONSchema7 = import('json-schema').JSONSchema7
type UiSchema = Record<string, any>

function isValidForm(form: any): form is IForm {
  return (
    typeof form === 'object'
    && form !== null
    && typeof form.id === 'string'
    && typeof form.name === 'string'
    && Array.isArray(form.sections)
    && form.sections.every(isValidSection)
  )
}

function isValidSection(section: any): section is IFormSection {
  return (
    typeof section === 'object'
    && section !== null
    && typeof section.id === 'string'
    && typeof section.title === 'string'
    && Array.isArray(section.questions)
    && section.questions.every(isValidQuestion)
  )
}

function isValidQuestion(question: any): question is IFormQuestion {
  const needsOptions = [
    QuestionType.Select,
    QuestionType.Radio,
    QuestionType.Scoring,
    QuestionType.Checkbox,
  ].includes(question.type)
  return (
    typeof question === 'object'
    && question !== null
    && typeof question.id === 'string'
    && typeof question.title === 'string'
    && ((needsOptions && Array.isArray(question.options)) || !needsOptions)
  )
}

/**
 * Aggregate a form, sections, and section questions into a single IFormAggregated object
 * @param form - The form to aggregate
 * @param sections - The sections to aggregate
 * @param sectionQuestions - The section questions to aggregate
 * @param components - The components to aggregate - usually pre-loaded from the formStore cache
 * @returns The aggregated form
 */
export function aggregateForm(form: IForm, sections: IFormSection[], sectionQuestions: Record<string, IFormQuestion[]>, components: IFormComponent[]): IFormAggregated {

  const _schema = {
    ...form,
    sections: orderBy(sections.map(section => ({
      ...section,
      questions: orderBy(sectionQuestions[section.id!] || [], 'order'),
    })), 'order'),
  }

  return {
    ..._schema,
    jsonSchema: buildJsonSchemaFromForm(_schema),
    uiSchema: buildUiSchemaFromForm(_schema, components),
  }
}

/**
 *  Widgets are persisted through the CustomComponent path: the backend stores them as
 * `type: CustomComponent` with the widget kind in `component.type` and config as flat fields on
 * `component` (round-tripped as free-form JSON — no first-class QuestionType on the service).
 * This maps each such component kind to the internal QuestionType the render pipeline understands.
 */
const COMPONENT_TYPE_TO_QUESTION_TYPE: Partial<Record<ComponentType, QuestionType>> = {
  [ComponentType.InfoCard]: QuestionType.InfoCard,
  [ComponentType.InfoMessage]: QuestionType.InfoMessage,
  [ComponentType.Or]: QuestionType.Or,
  [ComponentType.VerificationCode]: QuestionType.VerificationCode,
  [ComponentType.DateDropdown]: QuestionType.DateDropdown,
  [ComponentType.Email]: QuestionType.Email,
  [ComponentType.Phone]: QuestionType.Phone,
  [ComponentType.Number]: QuestionType.Number,
  [ComponentType.RadioCards]: QuestionType.RadioCards,
  [ComponentType.CheckboxCards]: QuestionType.CheckboxCards,
  [ComponentType.ContactVerification]: QuestionType.ContactVerification,
}

/** Inverse of COMPONENT_TYPE_TO_QUESTION_TYPE — used when emitting the persisted CustomComponent shape. */
const QUESTION_TYPE_TO_COMPONENT_TYPE: Partial<Record<QuestionType, ComponentType>> = Object.fromEntries(
  Object.entries(COMPONENT_TYPE_TO_QUESTION_TYPE).map(([c, q]) => [q, c as ComponentType]),
) as Partial<Record<QuestionType, ComponentType>>

/**
 * Normalize a widget question persisted as CustomComponent into the internal flat shape the
 * builders already handle. Config is read from `component` first, falling back to any top-level
 * fields so pre-migration (first-class) data still renders. CurrentUserName/SectionPicker keep
 * `type: CustomComponent` (they are handled by the existing componentId path) and pass through.
 */
function normalizeQuestion(q: IFormQuestion): IFormQuestion {
  if (q.type !== QuestionType.CustomComponent || !q.component?.type) {
    return q
  }
  const mapped = COMPONENT_TYPE_TO_QUESTION_TYPE[q.component.type]
  if (!mapped) {
    return q
  }
  const c = q.component
  return {
    ...q,
    type: mapped,
    preText: c.preText ?? q.preText,
    text: c.text ?? q.text,
    body: c.body ?? q.body,
    placeholder: c.placeholder ?? q.placeholder,
    styles: c.styles ?? q.styles,
    list: c.list ?? q.list,
    icon: c.icon ?? q.icon,
    content: c.content ?? q.content,
    codeLength: c.codeLength ?? q.codeLength,
    minYear: c.minYear ?? q.minYear,
    maxYear: c.maxYear ?? q.maxYear,
    cards: c.cards ?? q.cards,
    maskedEmailLabel: c.maskedEmailLabel ?? q.maskedEmailLabel,
    maskedPhoneLabel: c.maskedPhoneLabel ?? q.maskedPhoneLabel,
    orLabel: c.orLabel ?? q.orLabel,
    validation: {
      ...q.validation,
      minLength: c.minLength ?? q.validation?.minLength,
      maxLength: c.maxLength ?? q.validation?.maxLength,
      pattern: c.pattern ?? q.validation?.pattern,
      minimum: c.minimum ?? q.validation?.minimum,
      maximum: c.maximum ?? q.validation?.maximum,
    },
  }
}

/** Apply normalizeQuestion across every question in the form. */
function normalizeForm(form: IForm): IForm {
  return {
    ...form,
    sections: (form.sections ?? []).map(section => ({
      ...section,
      questions: (section.questions ?? []).map(normalizeQuestion),
    })),
  }
}

export function buildFormFromJsonSchema(schema: JSONSchema7, uiSchema: UiSchema): IForm {
  if (typeof schema !== 'object' || schema === null || schema.type !== 'object' || typeof schema.title !== 'string' || !schema.properties) {
    throw new Error('Invalid JSON Schema')
  }

  // normalize uiSchema input
  const ui: UiSchema = (typeof uiSchema === 'object' && uiSchema !== null) ? uiSchema as UiSchema : {}

  // basic validation already done above; cast now for convenience
  const root = schema as JSONSchema7

  const form: IForm = {
    id: root.$id ?? `form:${Math.random().toString(36).slice(2, 9)}`,
    name: root.title ?? 'Untitled Form',
    source: 'json-schema',
    version: (root.$id && String(root.$id)) || '1',
    anonymous: false,
    submissionCount: 0,
    description: root.description,
    modifiedDate: new Date().toISOString(),
    status: 'Draft',
    sections: [],
  }

  const rootProps = (root.properties ?? {}) as Record<string, JSONSchema7>

  // optional top-level ordering of sections from uiSchema
  const sectionOrder = Array.isArray(ui['ui:order']) ? ui['ui:order'] as string[] : Object.keys(rootProps)

  for (const sectionId of sectionOrder) {
    const sectionSchema = rootProps[sectionId]
    if (!sectionSchema || sectionSchema.type !== 'object' || !sectionSchema.properties) {
      // skip non-object section definitions
      continue
    }

    const sectionUi = (ui[sectionId] && typeof ui[sectionId] === 'object') ? ui[sectionId] as UiSchema : {}
    const section: IFormSection = {
      id: sectionId,
      formId: form.id,
      title: sectionSchema.title ?? sectionId,
      description: sectionSchema.description,
      subHeading: sectionUi['ui:subHeading'],
      questions: [],
      order: 0,
    }
    const qOrder = Array.isArray(sectionUi['ui:order']) ? sectionUi['ui:order'] as string[] : Object.keys(sectionSchema.properties as Record<string, JSONSchema7>)

    const qProps = sectionSchema.properties as Record<string, JSONSchema7>
    const sectionRequired = Array.isArray(sectionSchema.required) ? sectionSchema.required as string[] : []

    let questionCountIndex = 0
    for (const qId of qOrder) {
      const qSchema = qProps[qId] as JSONSchema7
      if (!qSchema) { continue }

      // determine type: enum -> select, else check ui widget for textarea, else text
      const qUi = (sectionUi[qId] && typeof sectionUi[qId] === 'object') ? sectionUi[qId] as UiSchema : {}
      let qType: QuestionType = QuestionType.TextArea
      if (qUi['ui:widget'] === 'ScoringWidget') {
        qType = QuestionType.Scoring
      }
      else if (qUi['ui:widget'] === 'ImageWidget') {
        qType = QuestionType.Image
      }
      else if (qUi['ui:widget'] === 'HtmlWidget') {
        qType = QuestionType.Html
      }
      else if (qUi['ui:widget'] === 'CheckboxWidget') {
        qType = QuestionType.Checkbox
      }
      else if (qUi['ui:widget'] === 'EmailWidget') {
        qType = QuestionType.Email
      }
      else if (qUi['ui:widget'] === 'PhoneWidget') {
        qType = QuestionType.Phone
      }
      else if (qUi['ui:widget'] === 'NumberWidget') {
        qType = QuestionType.Number
      }
      else if (qUi['ui:widget'] === 'OrWidget') {
        qType = QuestionType.Or
      }
      else if (qUi['ui:widget'] === 'InfoMessageWidget') {
        qType = QuestionType.InfoMessage
      }
      else if (qUi['ui:widget'] === 'InfoCardWidget') {
        qType = QuestionType.InfoCard
      }
      else if (qUi['ui:widget'] === 'VerificationCodeWidget') {
        qType = QuestionType.VerificationCode
      }
      else if (qUi['ui:widget'] === 'DateDropdownWidget') {
        qType = QuestionType.DateDropdown
      }
      else if (qUi['ui:field'] === 'RadioCardsField') {
        qType = QuestionType.RadioCards
      }
      else if (qUi['ui:field'] === 'CheckboxCardsField') {
        qType = QuestionType.CheckboxCards
      }
      else if (qUi['ui:field'] === 'ContactVerificationField') {
        qType = QuestionType.ContactVerification
      }
      else if (Array.isArray(qSchema.enum) && qSchema.enum.length > 0) {
        if (qUi['ui:widget'] && qUi['ui:widget'] === 'RadioWidget') {
          qType = QuestionType.Radio
        }
        else {
          qType = QuestionType.Select
        }
      }
      else if (qUi['ui:widget'] === 'textarea' || qUi['ui:widget'] === 'code' || qUi['ui:widget'] === 'textarea-widget') {
        // common textarea widget identifiers; default to 'textarea' when explicitly set
        qType = QuestionType.TextArea
      }
      else if (qUi['ui:widget'] === 'date') {
        qType = QuestionType.Date
      }
      else {
        // fallback: if schema.format indicates multiline (rare), treat as textarea
        const format = (qSchema as JSONSchema7).format
        if (format === 'textarea' || format === 'multiline') {
          qType = QuestionType.TextArea
        }
      }

      const multilineFromUi = (qUi['ui:options'] as { multiline?: boolean } | undefined)?.multiline === true
      const multiline
        = qType === QuestionType.TextArea
        || multilineFromUi

      const question: IFormQuestion = {
        id: qId,
        formId: form.id,
        sectionId: section.id ?? '',
        validation: {
          minLength: (typeof qSchema.minLength === 'number' && qSchema.minLength > 0) ? qSchema.minLength : undefined,
          maxLength: (typeof qSchema.maxLength === 'number' && qSchema.maxLength > 0) ? qSchema.maxLength : undefined,
          pattern: typeof qSchema.pattern === 'string' ? qSchema.pattern : undefined,
          minimum: typeof qSchema.minimum === 'number' ? qSchema.minimum : undefined,
          maximum: typeof qSchema.maximum === 'number' ? qSchema.maximum : undefined,
        },
        title: qSchema.title ?? qId,
        description: qSchema.description ?? (qUi['ui:placeholder'] ? String(qUi['ui:placeholder']) : undefined),
        type: qType,
        multiline,
        required: sectionRequired.includes(qId),
        order: questionCountIndex++,
      }

      if ([
        'select',
        'radio',
        'Rating',
      ].includes(qType)) {
        const enumVals = Array.isArray((qSchema).enum) ? qSchema.enum.filter(isNonEmptyString) as string[] : []
        // try to pick labels from ui:options.enumOptions if present
        const enumOptions = Array.isArray(qUi?.['ui:options']?.enumOptions)
          ? (qUi['ui:options'].enumOptions as any[]).map(o => o && (o.value ?? o)) as string[]
          : enumVals
        question.options = enumOptions
      }
      if (qType === QuestionType.Checkbox) {
        // Checkbox enum lives on the array's `items`, not the top-level schema.
        const itemsSchema = (qSchema.items && typeof qSchema.items === 'object' && !Array.isArray(qSchema.items))
          ? qSchema.items as JSONSchema7
          : undefined
        const enumVals = Array.isArray(itemsSchema?.enum)
          ? itemsSchema!.enum!.filter(isNonEmptyString) as string[]
          : []
        const enumOptions = Array.isArray(qUi?.['ui:options']?.enumOptions)
          ? (qUi['ui:options'].enumOptions as any[]).map(o => o && (o.value ?? o)) as string[]
          : enumVals
        question.options = enumOptions
      }
      if (qType === QuestionType.Image || qType === QuestionType.Html) {
        question.defaultValue = typeof qSchema.default === 'string' ? qSchema.default : undefined
      }
      if (qType === QuestionType.Email || qType === QuestionType.Phone) {
        question.placeholder = typeof qUi['ui:placeholder'] === 'string' ? qUi['ui:placeholder'] : undefined
      }
      if (qType === QuestionType.Or) {
        const orOpts = (qUi['ui:options'] ?? {}) as Record<string, unknown>
        question.text = typeof orOpts.label === 'string' ? orOpts.label : undefined
      }
      if (qType === QuestionType.InfoMessage) {
        const infoOpts = (qUi['ui:options'] ?? {}) as Record<string, unknown>
        question.preText = typeof infoOpts.preText === 'string' ? infoOpts.preText : undefined
        question.text = typeof infoOpts.text === 'string' ? infoOpts.text : undefined
        question.body = typeof infoOpts.body === 'string' ? infoOpts.body : undefined
        question.styles = (infoOpts.customStyles && typeof infoOpts.customStyles === 'object') ? infoOpts.customStyles as Record<string, unknown> : undefined
        question.list = Array.isArray(infoOpts.list)
          ? (infoOpts.list as unknown[]).filter((s): s is string => typeof s === 'string')
          : undefined
      }
      if (qType === QuestionType.InfoCard) {
        const cardOpts = (qUi['ui:options'] ?? {}) as Record<string, unknown>
        question.icon = typeof cardOpts.icon === 'string' ? cardOpts.icon : undefined
        question.styles = (cardOpts.customStyles && typeof cardOpts.customStyles === 'object') ? cardOpts.customStyles as Record<string, unknown> : undefined
        question.content = Array.isArray(cardOpts.content)
          ? (cardOpts.content as unknown[]).filter((b): b is InfoCardContentBlock =>
              typeof b === 'object' && b !== null
              && ((b as any).type === 'paragraph' || (b as any).type === 'list' || (b as any).type === 'rows'))
          : undefined
      }
      if (qType === QuestionType.VerificationCode) {
        const codeOpts = (qUi['ui:options'] ?? {}) as Record<string, unknown>
        question.codeLength = typeof codeOpts.length === 'number' ? codeOpts.length : undefined
      }
      if (qType === QuestionType.DateDropdown) {
        const dateOpts = (qUi['ui:options'] ?? {}) as Record<string, unknown>
        question.minYear = typeof dateOpts.minYear === 'number' ? dateOpts.minYear : undefined
        question.maxYear = typeof dateOpts.maxYear === 'number' ? dateOpts.maxYear : undefined
      }
      if (qType === QuestionType.RadioCards || qType === QuestionType.CheckboxCards) {
        const cardOpts = (qUi['ui:options'] ?? {}) as Record<string, unknown>
        const parsed = parseRadioCards(cardOpts.cards)
        question.cards = parsed.length ? parsed : undefined
        question.styles = (cardOpts.customStyles && typeof cardOpts.customStyles === 'object') ? cardOpts.customStyles as Record<string, unknown> : undefined
      }
      if (qType === QuestionType.ContactVerification) {
        const cvOpts = (qUi['ui:options'] ?? {}) as Record<string, unknown>
        question.icon = typeof cvOpts.icon === 'string' ? cvOpts.icon : undefined
        question.styles = (cvOpts.customStyles && typeof cvOpts.customStyles === 'object') ? cvOpts.customStyles as Record<string, unknown> : undefined
        question.maskedEmailLabel = typeof cvOpts.maskedEmailLabel === 'string' ? cvOpts.maskedEmailLabel : undefined
        question.maskedPhoneLabel = typeof cvOpts.maskedPhoneLabel === 'string' ? cvOpts.maskedPhoneLabel : undefined
        question.orLabel = typeof cvOpts.orLabel === 'string' ? cvOpts.orLabel : undefined
      }

      // Persist Widgets through the CustomComponent path: move the widget kind + the config
      // extracted above into the free-form `component` blob so the service round-trips them without
      // a first-class QuestionType. This is the exact inverse of normalizeQuestion in the render
      // pipeline, so aggregateForm(buildFormFromJsonSchema(...)) is a no-op round trip.
      const componentType = QUESTION_TYPE_TO_COMPONENT_TYPE[qType]
      if (componentType) {
        const v = question.validation
        question.component = {
          type: componentType,
          ...(question.preText !== undefined ? { preText: question.preText } : {}),
          ...(question.text !== undefined ? { text: question.text } : {}),
          ...(question.body !== undefined ? { body: question.body } : {}),
          ...(question.placeholder !== undefined ? { placeholder: question.placeholder } : {}),
          ...(question.styles !== undefined ? { styles: question.styles } : {}),
          ...(question.list !== undefined ? { list: question.list } : {}),
          ...(question.icon !== undefined ? { icon: question.icon } : {}),
          ...(question.content !== undefined ? { content: question.content } : {}),
          ...(question.codeLength !== undefined ? { codeLength: question.codeLength } : {}),
          ...(question.minYear !== undefined ? { minYear: question.minYear } : {}),
          ...(question.maxYear !== undefined ? { maxYear: question.maxYear } : {}),
          ...(question.cards !== undefined ? { cards: question.cards } : {}),
          ...(question.maskedEmailLabel !== undefined ? { maskedEmailLabel: question.maskedEmailLabel } : {}),
          ...(question.maskedPhoneLabel !== undefined ? { maskedPhoneLabel: question.maskedPhoneLabel } : {}),
          ...(question.orLabel !== undefined ? { orLabel: question.orLabel } : {}),
          ...(v?.minLength !== undefined ? { minLength: v.minLength } : {}),
          ...(v?.maxLength !== undefined ? { maxLength: v.maxLength } : {}),
          ...(v?.pattern !== undefined ? { pattern: v.pattern } : {}),
          ...(v?.minimum !== undefined ? { minimum: v.minimum } : {}),
          ...(v?.maximum !== undefined ? { maximum: v.maximum } : {}),
        }
        question.type = QuestionType.CustomComponent
        // The config now lives in `component`; clear the flat fields so there is a single source of truth.
        question.preText = undefined
        question.text = undefined
        question.body = undefined
        question.styles = undefined
        question.list = undefined
        question.icon = undefined
        question.content = undefined
        question.codeLength = undefined
        question.minYear = undefined
        question.maxYear = undefined
        question.cards = undefined
        question.maskedEmailLabel = undefined
        question.maskedPhoneLabel = undefined
        question.orLabel = undefined
        question.validation = undefined
      }

      section.questions?.push(question as any)
    }

    // only include sections that have at least one question
    if ((section.questions?.length ?? -1) > 0) {
      form.sections?.push(section)
    }
  }

  // final minimal validation: must have at least one section
  if (!Array.isArray(form.sections) || form.sections.length === 0) {
    throw new Error('Schema did not contain any valid sections/questions')
  }

  return form
}

/** Build RJSF-compatible JSON Schema from form */
export function buildJsonSchemaFromForm(form: IForm): JSONSchema7 {
  if (!isValidForm(form)) {
    throw new Error('Invalid form data')
  }
  form = normalizeForm(form)
  const schema: JSONSchema7 = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: form.id,
    title: form.name,
    description: form.description,
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: false,
  }

  for (const section of (form.sections ?? [])) {
    const sectionSchema: JSONSchema7 = {
      type: 'object',
      title: section.title,
      description: section.description,
      properties: {},
      required: [],
      additionalProperties: false,
    }

    // All questions live in base properties so RJSF always renders them; visibility is driven
    // by ui:conditions in ConditionalFieldTemplate (dependencies/oneOf merging was unreliable
    // for sections with multiple fields and mixed rules).
    // Html and Image questions are display-only decoratives — they are rendered by
    // ObjectFieldTemplate directly from uiSchema and must not appear in formData.
    for (const q of (section.questions ?? [])) {
      if (q.type === QuestionType.Html || q.type === QuestionType.Image) {
        continue
      }
      const qSchema = buildQuestionSchema(q)
      const fieldKey: string = q.id ?? ''

      if (q.type === QuestionType.Select || q.type === QuestionType.Radio) {
        qSchema.enum = q.options ?? []
      }
      else if (q.type === QuestionType.Scoring) {
        qSchema.enum = (q.options && q.options.length > 0)
          ? q.options
          : [
              '4',
              '3',
              '2',
              '1',
              '0',
            ]
      }
      ;(sectionSchema.properties as Record<string, JSONSchema7>)[fieldKey] = qSchema
      // Do not mark conditional questions as schema-required: they stay in properties but can be
      // hidden via ui:conditions; JSON Schema cannot express "required when visible" without if/then.
      if (q.required && !q.visibilityCondition?.rules?.length) {
        (sectionSchema.required as string[]).push(fieldKey)
      }
    }

    // Clean empty required arrays to keep schema tidy
    if ((sectionSchema.required as string[]).length === 0) {
      delete sectionSchema.required
    }

    const sectionKey: string = section.id ?? ''
    ;(schema.properties as Record<string, JSONSchema7>)[sectionKey] = sectionSchema
    ;(schema.required as string[]).push(sectionKey)
  }

  if ((schema.required as string[]).length === 0) {
    delete schema.required
  }

  return schema
}

/** Build RJSF uiSchema from form */
export function buildUiSchemaFromForm(form: IForm, components: IFormComponent[]): UiSchema {
  if (!isValidForm(form)) {
    throw new Error('Invalid form data')
  }
  form = normalizeForm(form)

  // Build a global map from question ID to its full dot-path (sectionKey.fieldKey)
  // so cross-section condition references resolve to the correct path in formData.
  const globalQuestionPathById: Record<string, string> = {}
  for (const s of (form.sections ?? [])) {
    const sk: string = s.id ?? ''
    for (const q of (s.questions ?? [])) {
      if (q.id) {
        globalQuestionPathById[q.id] = `${sk}.${q.id}`
      }
    }
  }

  const uiSchema: UiSchema = { 'ui:order': form.sections?.map(s => s.id ?? '') }
  if (form.image) {
    uiSchema['ui:image'] = form.image
  }
  if (form.name) {
    uiSchema['ui:name'] = form.name
  }
  if (form.description) {
    uiSchema['ui:description'] = form.description
  }
  for (const section of (form.sections ?? [])) {
    const sectionKey = section.id ?? ''
    const sectionUi: UiSchema = {}
    if (section.subHeading) {
      sectionUi['ui:subHeading'] = section.subHeading
    }

    const sortedQuestions = (section.questions ?? []).toSorted((a, b) => a.order! - b.order!)
    const fullOrder: string[] = sortedQuestions.map(q => q.id ?? '')
    const decorativeFields: Record<string, { widget: 'HtmlWidget' | 'ImageWidget', content: string, alt?: string, title?: string }> = {}

    for (const q of sortedQuestions) {
      const fieldKey: string = q.id ?? ''

      // Html/Image are display-only: store as decorative so ObjectFieldTemplate can render them
      // without polluting formData (they are excluded from the JSON schema).
      if (q.type === QuestionType.Html) {
        decorativeFields[fieldKey] = { widget: 'HtmlWidget', content: q.defaultValue ?? '' }
        continue
      }
      if (q.type === QuestionType.Image) {
        decorativeFields[fieldKey] = { widget: 'ImageWidget', content: q.defaultValue ?? '', alt: q.description, title: q.title }
        continue
      }

      switch (q.type) {
        case QuestionType.Date:
          sectionUi[fieldKey] = {
            'ui:widget': 'date',
            'ui:placeholder': q.description ?? 'Enter Date Picker',
          }
          break
        case QuestionType.DateDropdown:
          sectionUi[fieldKey] = {
            'ui:widget': 'DateDropdownWidget',
            'ui:options': {
              ...(typeof q.minYear === 'number' ? { minYear: q.minYear } : {}),
              ...(typeof q.maxYear === 'number' ? { maxYear: q.maxYear } : {}),
            },
          }
          break
        case QuestionType.TextArea:
          sectionUi[fieldKey] = {
            'ui:widget': 'textarea',
            ...(q.multiline ? { 'ui:options': { rows: 4, multiline: true } } : {}),
            'ui:placeholder': q.description ?? 'Enter text',
          }
          break
        case QuestionType.Select:
          sectionUi[fieldKey] = {
            'ui:widget': 'select',
            'ui:placeholder': 'Select an option',
            'ui:options': {
              enumOptions: q.options?.map(opt => ({
                label: opt,
                value: opt,
              })),
            },
          }
          break
        case QuestionType.Radio:
          sectionUi[fieldKey] = {
            'ui:widget': 'radio',
            'ui:placeholder': 'Select an option',
            'ui:options': {
              enumOptions: q.options?.map(opt => ({
                label: opt,
                value: opt,
              })),
            },
          }
          break
        case QuestionType.Checkbox:
          sectionUi[fieldKey] = {
            'ui:widget': 'CheckboxWidget',
            'ui:placeholder': 'Select one or more options',
            'ui:options': {
              enumOptions: q.options?.map(opt => ({
                label: opt,
                value: opt,
              })),
            },
          }
          break
        case QuestionType.Scoring: {
          const values = ['4', '3', '2', '1', '0']
          sectionUi[fieldKey] = {
            'ui:widget': 'ScoringWidget',
            'ui:placeholder': 'Select a rating',
            'ui:options': {
              enumOptions: values.map(val => ({
                label: val === '0' ? 'N/A' : val,
                value: val,
              })),
            },
          }
          break
        }
        case QuestionType.Email:
          sectionUi[fieldKey] = {
            'ui:widget': 'EmailWidget',
            'ui:placeholder': q.placeholder ?? q.description ?? 'Enter email address',
          }
          break
        case QuestionType.Phone:
          sectionUi[fieldKey] = {
            'ui:widget': 'PhoneWidget',
            'ui:placeholder': q.placeholder ?? q.description ?? 'Enter phone number',
          }
          break
        case QuestionType.Number:
          sectionUi[fieldKey] = {
            'ui:widget': 'NumberWidget',
            'ui:placeholder': q.description ?? 'Enter a number',
          }
          break
        case QuestionType.Or:
          // Purely presentational separator; holds no value and is stripped from formData output.
          sectionUi[fieldKey] = {
            'ui:widget': 'OrWidget',
            'ui:options': { label: q.text || 'or' },
          }
          break
        case QuestionType.InfoMessage:
          // Purely presentational callout; holds no value and is stripped from formData output.
          sectionUi[fieldKey] = {
            'ui:widget': 'InfoMessageWidget',
            'ui:options': {
              ...(q.styles ? { customStyles: q.styles } : {}),
              ...(q.preText ? { preText: q.preText } : {}),
              ...(q.text ? { text: q.text } : {}),
              ...(q.body ? { body: q.body } : {}),
              ...(q.list && q.list.length ? { list: q.list } : {}),
            },
          }
          break
        case QuestionType.InfoCard:
          // Purely presentational summary card; holds no value and is stripped from formData output.
          sectionUi[fieldKey] = {
            'ui:widget': 'InfoCardWidget',
            'ui:options': {
              title: q.title,
              ...(q.icon ? { icon: q.icon } : {}),
              ...(q.styles ? { customStyles: q.styles } : {}),
              ...(q.content && q.content.length ? { content: q.content } : {}),
            },
          }
          break
        case QuestionType.VerificationCode:
          sectionUi[fieldKey] = {
            'ui:widget': 'VerificationCodeWidget',
            'ui:options': { length: q.codeLength && q.codeLength > 0 ? q.codeLength : 6 },
          }
          break
        case QuestionType.RadioCards:
          sectionUi[fieldKey] = {
            'ui:field': 'RadioCardsField',
            'ui:options': {
              cards: q.cards ?? [],
              ...(q.styles ? { customStyles: q.styles } : {}),
            },
          }
          break
        case QuestionType.CheckboxCards:
          sectionUi[fieldKey] = {
            'ui:field': 'CheckboxCardsField',
            'ui:options': {
              cards: q.cards ?? [],
              ...(q.styles ? { customStyles: q.styles } : {}),
            },
          }
          break
        case QuestionType.ContactVerification:
          sectionUi[fieldKey] = {
            'ui:field': 'ContactVerificationField',
            'ui:options': {
              title: q.title,
              ...(q.icon ? { icon: q.icon } : {}),
              ...(q.styles ? { customStyles: q.styles } : {}),
              ...(q.maskedEmailLabel ? { maskedEmailLabel: q.maskedEmailLabel } : {}),
              ...(q.maskedPhoneLabel ? { maskedPhoneLabel: q.maskedPhoneLabel } : {}),
              ...(q.orLabel ? { orLabel: q.orLabel } : {}),
            },
          }
          break
        default: {
          sectionUi[fieldKey] = {
            'ui:placeholder': q.description ?? 'Enter value',
            ...(q.multiline
              ? { 'ui:options': { multiline: true, rows: 4 } }
              : {}),
          }
          break
        }
      }

      if (q.component?.componentId) {
        const component = components?.find(c => c.id === q.component?.componentId)
        if (component) {
          if (component.type === ComponentType.CurrentUserName) {
            sectionUi[fieldKey] = {
              'ui:widget': 'CurrentUserName',
              'user': { 'ui:enumNames': (q.component.currentUser ? [q.component.currentUser] : []).map(s => `${s?.firstName} ${s?.lastName} (${s?.email})`) },
            }
          }
          if (component.type === ComponentType.SectionPicker) {
            sectionUi[fieldKey] = {
              'ui:field': 'SectionPicker',
              'ui:options': { schools: q.component.schools ?? [] },
            }
          }
        }
      }

      const visibilityCondition = q.visibilityCondition
      if (visibilityCondition?.rules?.length) {
        const rulesForUi = (visibilityCondition.rules ?? [])
          .map((rule) => {
            const fieldPath = globalQuestionPathById[rule.fieldId]
            if (!fieldPath) {
              return null
            }
            return {
              field: fieldPath,
              operator: rule.operator,
              value: rule.value,
            }
          })
          .filter((x): x is { field: string, operator: ConditionOperator, value: string } => !!x)

        if (rulesForUi.length) {
          const uiForField = (sectionUi[fieldKey] ||= {})
          uiForField['ui:conditions'] = {
            logic: visibilityCondition.logic,
            rules: rulesForUi,
          }
          if (q.required) {
            uiForField['ui:requiredWhenVisible'] = true
          }
        }
      }
    }

    // ui:order only lists schema-backed fields (decoratives are excluded so RJSF doesn't warn).
    // ui:fullOrder preserves the original field order including decoratives for ObjectFieldTemplate.
    sectionUi['ui:order'] = fullOrder.filter(id => !decorativeFields[id])
    sectionUi['ui:fullOrder'] = fullOrder
    if (Object.keys(decorativeFields).length > 0) {
      sectionUi['ui:decorativeFields'] = decorativeFields
    }

    uiSchema[sectionKey] = sectionUi
  }

  return uiSchema
}

const DISPLAY_ONLY_WIDGETS = new Set(['HtmlWidget', 'ImageWidget', 'OrWidget', 'InfoMessageWidget', 'InfoCardWidget'])

/**
 * Strip display-only fields (Html, Image) from RJSF formData before submission.
 * These widget types carry no user input and should never appear in a submission payload.
 */
export function filterSubmittableFormData(
  formData: Record<string, unknown>,
  uiSchema: Record<string, any>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [sectionKey, sectionData] of Object.entries(formData)) {
    if (typeof sectionData !== 'object' || sectionData === null) {
      result[sectionKey] = sectionData
      continue
    }
    const sectionUi = uiSchema[sectionKey] as Record<string, any> | undefined
    const filteredSection: Record<string, unknown> = {}
    for (const [fieldKey, fieldValue] of Object.entries(sectionData as Record<string, unknown>)) {
      const widget = (sectionUi?.[fieldKey] as Record<string, any> | undefined)?.['ui:widget']
      if (!DISPLAY_ONLY_WIDGETS.has(widget)) {
        filteredSection[fieldKey] = fieldValue
      }
    }
    result[sectionKey] = filteredSection
  }
  return result
}

/* ----------------- helpers ----------------- */

function buildQuestionSchema(q: IFormQuestion): JSONSchema7 {
  // Base string schema with titles/descriptions
  const base: JSONSchema7 = {
    type: 'string',
    title: q.title,
    description: q.description,
    default: q.defaultValue ? String(q.defaultValue) : undefined,

  }

  if (q.type === QuestionType.TextArea) {
    base.minLength = q.validation?.minLength
    base.maxLength = q.validation?.maxLength
  }

  if (q.type === QuestionType.Email) {
    base.format = 'email'
    base.minLength = q.validation?.minLength
    base.maxLength = q.validation?.maxLength
    if (q.validation?.pattern) {
      base.pattern = q.validation.pattern
    }
    return base
  }

  if (q.type === QuestionType.Phone) {
    base.minLength = q.validation?.minLength
    base.maxLength = q.validation?.maxLength
    if (q.validation?.pattern) {
      base.pattern = q.validation.pattern
    }
    return base
  }

  if (q.type === QuestionType.Number) {
    base.type = 'number'
    base.default = undefined
    if (typeof q.validation?.minimum === 'number') {
      base.minimum = q.validation.minimum
    }
    if (typeof q.validation?.maximum === 'number') {
      base.maximum = q.validation.maximum
    }
    return base
  }

  if (q.type === QuestionType.VerificationCode) {
    // Fixed-length numeric code; enforce exact digit count so partial entries fail validation.
    const len = q.codeLength && q.codeLength > 0 ? q.codeLength : 6
    base.minLength = len
    base.maxLength = len
    base.pattern = `^[0-9]{${len}}$`
    return base
  }

  if (q.type === QuestionType.DateDropdown) {
    // Assembled Year/Month/Day value, stored as an ISO calendar date string.
    base.format = 'date'
    base.pattern = '^\\d{4}-\\d{2}-\\d{2}$'
    return base
  }

  if (q.type === QuestionType.RadioCards || q.type === QuestionType.CheckboxCards) {
    // Cards store a flat object mapping each selected card's `value` to `true` (RadioCards keeps
    // the chosen card plus its ancestors; CheckboxCards keeps every checked card); unselected
    // cards are omitted. Every card + sub-item value is a known boolean property so stray keys
    // fail validation.
    const props: Record<string, JSONSchema7> = {}
    for (const value of flattenCardValues(q.cards)) {
      props[value] = { type: 'boolean' }
    }
    const schema: JSONSchema7 = {
      type: 'object',
      title: q.title,
      description: q.description,
      properties: props,
      additionalProperties: false,
    }
    // Hard-required means "at least one card selected"; conditional-required is handled at runtime.
    if (q.required && !q.visibilityCondition?.rules?.length) {
      schema.minProperties = 1
    }
    return schema
  }

  if (q.type === QuestionType.ContactVerification) {
    // Two independent, optional leaves gathered under one card: an email address and a phone
    // number, either of which the respondent may fill in.
    return {
      type: 'object',
      title: q.title,
      description: q.description,
      properties: {
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
      },
      additionalProperties: false,
    }
  }

  if (q.type === QuestionType.Or || q.type === QuestionType.InfoMessage || q.type === QuestionType.InfoCard) {
    // Presentational only: no user value, kept readOnly and filtered from output.
    base.readOnly = true
    return base
  }

  if (q.type === QuestionType.Checkbox) {
    const opts = Array.isArray(q.options) ? q.options.filter(isNonEmptyString) : []
    const schema: JSONSchema7 = {
      type: 'array',
      title: q.title,
      description: q.description,
      uniqueItems: true,
      items: {
        type: 'string',
        enum: opts.length ? opts : undefined,
      },
    }
    // Enforce "at least one" only for hard-required checkboxes; conditional-required is handled
    // at runtime by createConditionalRequiredCustomValidate so the schema stays permissive.
    if (q.required && !q.visibilityCondition?.rules?.length) {
      schema.minItems = 1
    }
    return schema
  }

  if (q.type === QuestionType.Select || q.type === QuestionType.Radio) {
    const opts = Array.isArray(q.options) ? q.options.filter(isNonEmptyString) : []
    return {
      ...base,
      enum: opts.length ? opts : undefined,
    }
  }
  if (q.type === QuestionType.Scoring) {
    const opts = Array.isArray(q.options) ? q.options.filter(isNonEmptyString) : []
    return {
      ...base,
      enum: opts.length
        ? opts
        : [
            '4',
            '3',
            '2',
            '1',
            '0',
          ],
    }
  }

  if (q.type === QuestionType.Image) {
    base.default = q.defaultValue ? String(q.defaultValue) : undefined
    return base
  }

  if (q.type === QuestionType.Html) {
    base.default = q.defaultValue ? String(q.defaultValue) : undefined
    base.readOnly = true
    return base
  }

  if (q.type === QuestionType.CustomComponent && q.component?.type === ComponentType.CurrentUserName) {
    base.type = 'object'
    base.title = q.title
    base.description = q.description
    base.properties = {
      user: {
        title: q.title,
        description: q.description,
        default: q.component.currentUser,
        enum: q.component.currentUser ? [q.component.currentUser] : [],
      },
    }
    base.readOnly = true
  }

  if (q.type === QuestionType.CustomComponent && q.component?.type === ComponentType.SectionPicker) {
    base.type = 'object'
    base.required = [
      'schoolId',
      'schoolName',
      'teacherName',
      'staffUniqueId',
      'sectionName',
      'sectionId',
      'courseId',
    ]

    base.properties = {
      schoolId: {
        title: 'School ID',
        type: ['string', 'number'],
      },
      schoolName: {
        title: 'School Name',
        type: 'string',
      },
      teacherName: {
        title: 'Teacher Name',
        type: 'string',
      },
      staffUniqueId: {
        title: 'Staff Unique ID',
        type: 'string',
      },
      sectionName: {
        title: 'Section Name',
        type: 'string',
      },
      sectionId: {
        title: 'Section ID',
        type: 'string',
      },
      courseId: {
        title: 'Course ID',
        type: 'string',
      },
    }
  }

  // textarea and text are both strings in JSON Schema; widget handled in uiSchema
  return base
}

function isNonEmptyString(s: unknown): s is string {
  return typeof s === 'string' && s.trim().length > 0
}

/**
 * Coerce loosely-typed ui:options.cards into a clean RadioCardItem[] (recursively for subItems).
 * Cards without a usable `value`/`title` are dropped.
 */
function parseRadioCards(raw: unknown): RadioCardItem[] {
  if (!Array.isArray(raw)) {
    return []
  }
  return raw
    .map((card): RadioCardItem | null => {
      if (typeof card !== 'object' || card === null) {
        return null
      }
      const { value, title, description, icon, subItems } = card as Record<string, unknown>
      if (typeof value !== 'string' || value === '') {
        return null
      }
      const item: RadioCardItem = {
        value,
        title: typeof title === 'string' ? title : value,
      }
      if (typeof description === 'string' && description !== '') {
        item.description = description
      }
      if (typeof icon === 'string' && icon !== '') {
        item.icon = icon
      }
      const parsedSub = parseRadioCards(subItems)
      if (parsedSub.length) {
        item.subItems = parsedSub
      }
      return item
    })
    .filter((card): card is RadioCardItem => card !== null)
}

/** Flatten a RadioCardItem tree into the full list of selectable `value`s (parents + sub-items). */
function flattenCardValues(cards: RadioCardItem[] | undefined): string[] {
  if (!Array.isArray(cards)) {
    return []
  }
  const out: string[] = []
  for (const card of cards) {
    if (isNonEmptyString(card.value)) {
      out.push(card.value)
    }
    out.push(...flattenCardValues(card.subItems))
  }
  return out
}
