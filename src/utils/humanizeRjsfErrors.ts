import type {
  RJSFSchema,
  RJSFValidationError,
  UiSchema,
} from '@rjsf/utils'

/** Turn slug / kebab segments into Title Case words for fallback labels */
function slugToLabel(segment: string): string {
  return segment
    .split('-')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const REGEX_DOT = /^\./
const REGEX_DOT_PATH_REQUIRED = /^\.?([\w.-]+(?:\.[\w.-]+)*)\s+is\s+required\.?$/i
const REGEX_STRAIGHT_APOSTROPHE = /'/g
const REGEX_HTML_TAG = /<[^>]*>/g

function plainTextLabel(value: string): string {
  return value.replace(REGEX_HTML_TAG, ' ').replace(/\s+/g, ' ').trim()
}

/** Wrap label in straight single quotes; normalize apostrophes inside the label (→ U+2019) so wrapping stays clear. */
export function quotedFieldLabel(label: string): string {
  const safe = plainTextLabel(label).replace(REGEX_STRAIGHT_APOSTROPHE, '"')
  return `'${safe}'`
}

/** Public: label for `sectionKey.fieldKey` from JSON Schema `title` (e.g. conditional required messaging). */
export function fieldTitleFromSectionField(
  rootSchema: RJSFSchema | undefined,
  sectionKey: string,
  fieldKey: string,
): string {
  const section = (rootSchema?.properties as Record<string, RJSFSchema> | undefined)?.[sectionKey]
  const field = (section?.properties as Record<string, RJSFSchema> | undefined)?.[fieldKey]
  const t = field?.title
  if (typeof t === 'string' && t.trim()) {
    return plainTextLabel(t)
  }
  return slugToLabel(fieldKey)
}

/** AJV/custom errors sometimes use message/stack like `.road.main-street-name is required` before humanize runs. */
function parseDotPathFromRequiredText(text: string | undefined): string | undefined {
  if (!text) {
    return undefined
  }
  const m = text.trim().match(REGEX_DOT_PATH_REQUIRED)
  return m?.[1]
}

/** Resolve JSON Schema `title` for a dot-path like `.road.main-street-name` */
function titleFromSchema(schema: RJSFSchema | undefined, dataPath: string): string | undefined {
  if (!schema || !dataPath) {
    return undefined
  }
  const parts = dataPath.replace(REGEX_DOT, '').split('.').filter(Boolean)
  let node: Record<string, unknown> | undefined = schema as Record<string, unknown>
  for (const p of parts) {
    const props = node?.properties as Record<string, unknown> | undefined
    if (!props?.[p]) {
      return undefined
    }
    node = props[p] as Record<string, unknown>
  }
  const t = node?.title
  return typeof t === 'string' && t.trim() ? t : undefined
}

function labelForField(
  err: RJSFValidationError,
  rootSchema: RJSFSchema | undefined,
  uiSchema: UiSchema | undefined,
): string {
  if (err.title && String(err.title).trim()) {
    return plainTextLabel(String(err.title))
  }
  const fromMessage = parseDotPathFromRequiredText(err.message)
    ?? parseDotPathFromRequiredText(err.stack)
  const prop = err.property?.replace(REGEX_DOT, '') || fromMessage || ''
  const missing = err.params?.missingProperty as string | undefined
  const fullPath = missing && prop ? `${prop}.${missing}` : prop

  const fromUiTitle = (() => {
    if (!fullPath || !uiSchema) {
      return undefined
    }
    const uiNode = fullPath.split('.').reduce<unknown>((acc, key) => {
      if (acc != null && typeof acc === 'object' && key in (acc as object)) {
        return (acc as Record<string, unknown>)[key]
      }
      return undefined
    }, uiSchema as Record<string, unknown>)
    if (uiNode != null && typeof uiNode === 'object' && 'ui:title' in uiNode) {
      const t = (uiNode as { 'ui:title'?: unknown })['ui:title']
      return typeof t === 'string' && t.trim() ? t.trim() : undefined
    }
    return undefined
  })()

  return plainTextLabel(
    fromUiTitle
    ?? titleFromSchema(rootSchema, `.${fullPath}`)
    ?? (missing ? slugToLabel(missing) : slugToLabel(fullPath.split('.').pop() ?? 'Field')))
}

/**
 * Drop noisy parent `oneOf` errors when a more specific error exists under that object
 * (e.g. hide ".road must match exactly one schema" when ".road.road-type" already failed).
 */
function filterRedundantOneOf(errors: RJSFValidationError[]): RJSFValidationError[] {
  return errors.filter((err, index) => {
    if (err.name !== 'oneOf') {
      return true
    }
    const base = err.property ?? ''
    if (!base) {
      return true
    }
    const prefix = `${base}.`
    return !errors.some((other, j) =>
      j !== index
      && !!other.property
      && other.property.startsWith(prefix)
      && other.name !== 'oneOf')
  })
}

const REGEX_SPACE = /^\s*/

/** Drop duplicate entries (same field path + same message) after merging AJV + custom validation. */
function dedupeRjsfErrors(errors: RJSFValidationError[]): RJSFValidationError[] {
  const seen = new Set<string>()
  const out: RJSFValidationError[] = []
  for (const e of errors) {
    const prop = (e.property ?? '').replace(REGEX_DOT, '').trim()
    const msg = (e.message ?? e.stack ?? '').trim()
    const key = `${prop}|${msg}`
    if (seen.has(key)) {
      continue
    }
    seen.add(key)
    out.push(e)
  }
  return out
}

/** Sub-keys of the SectionPicker composite object (see `buildQuestionSchema` for SectionPicker). */
const SECTION_PICKER_REQUIRED_KEYS = new Set([
  'schoolId',
  'schoolName',
  'teacherName',
  'staffUniqueId',
  'sectionName',
  'sectionId',
  'courseId',
])

/** AJV / RJSF may set `property` to the parent object or to the leaf path; bucket by the object that owns `missingProperty`. */
function sectionPickerRequiredParentPath(err: RJSFValidationError): string {
  const miss = err.params?.missingProperty as string | undefined
  const prop = (err.property ?? '').replace(REGEX_DOT, '').trim()
  if (!miss || !prop) {
    return prop
  }
  const suffix = `.${miss}`
  if (prop.endsWith(suffix)) {
    return prop.slice(0, -suffix.length)
  }
  return prop
}

/**
 * AJV emits one `required` error per missing sub-property; the UI only has three steps. Merge those into a single
 * message on the parent path so the error list matches what users see.
 */
function mergeSectionPickerRequiredErrors(
  errors: RJSFValidationError[],
  rootSchema: RJSFSchema | undefined,
): RJSFValidationError[] {
  const buckets = new Map<string, RJSFValidationError[]>()
  const rest: RJSFValidationError[] = []

  for (const err of errors) {
    const miss = err.params?.missingProperty as string | undefined
    const parentPath = sectionPickerRequiredParentPath(err)
    if (err.name === 'required' && miss && parentPath && SECTION_PICKER_REQUIRED_KEYS.has(miss)) {
      const list = buckets.get(parentPath) ?? []
      list.push(err)
      buckets.set(parentPath, list)
    }
    else {
      rest.push(err)
    }
  }

  const out: RJSFValidationError[] = [...rest]

  for (const [parentPath, group] of buckets) {
    if (!group.length) {
      continue
    }
    const baseTitle
      = titleFromSchema(rootSchema, `.${parentPath}`)
      ?? slugToLabel(parentPath.split('.').pop() ?? 'Field')
    const quoted = quotedFieldLabel(plainTextLabel(baseTitle))
    const msg = `${quoted} requires a school, teacher, and section.`
    const first = group[0]
    out.push({
      ...first,
      property: `.${parentPath}`,
      message: msg,
      stack: msg,
      title: plainTextLabel(baseTitle),
      name: 'required',
      params: {
        ...first.params,
        missingProperty: undefined,
        mergedSectionPicker: true,
      },
    })
  }

  return out
}

/**
 * Replace robotic AJV messages with end-user copy, especially for dependencies / oneOf.
 */
export function humanizeRjsfErrors(
  errors: RJSFValidationError[],
  uiSchema: UiSchema | undefined,
  rootSchema: RJSFSchema | undefined,
): RJSFValidationError[] {
  const filtered = filterRedundantOneOf(errors)
  const mergedPicker = mergeSectionPickerRequiredErrors(filtered, rootSchema)

  const mapped = mergedPicker.map((err) => {
    if (err.params?.mergedSectionPicker) {
      return err
    }
    const label = labelForField(err, rootSchema, uiSchema)
    const name = err.name

    if (name === 'oneOf') {
      const msg
        = 'These answers don\'t line up with your selections above. Please fix the fields highlighted below.'
      return {
        ...err,
        message: msg,
        stack: msg,
      }
    }

    const trimmedMsg = err.message?.trim() ?? ''
    const isBareRequired = trimmedMsg === 'is required'
    const isPathRequired
      = !!parseDotPathFromRequiredText(err.message) || !!parseDotPathFromRequiredText(err.stack)

    const quoted = quotedFieldLabel(label)

    if (name === 'required' || isBareRequired || isPathRequired) {
      const msg = `${quoted} is required.`
      return {
        ...err,
        message: msg,
        stack: msg,
        title: label,
      }
    }

    if (name === 'enum' || name === 'const') {
      const msg = `${quoted}: please choose one of the available options.`
      return {
        ...err,
        message: msg,
        stack: msg,
        title: label,
      }
    }

    if (name === 'type') {
      const msg = `${quoted} has an invalid type.`
      return {
        ...err,
        message: msg,
        stack: msg,
        title: label,
      }
    }

    if (name === 'minLength' || name === 'maxLength') {
      const msg = err.message?.includes(label)
        ? err.message
        : `${quoted}: ${(err.message ?? '').replace(REGEX_SPACE, '')}`
      return {
        ...err,
        message: msg,
        stack: msg,
        title: label,
      }
    }

    const trimmed = (err.message ?? '').trim()
    const stack = trimmed && !trimmed.startsWith(quoted)
      ? `${quoted}: ${trimmed}`
      : trimmed || err.stack

    return {
      ...err,
      stack,
      title: label,
    }
  })

  return dedupeRjsfErrors(mapped)
}
