import type { JSONSchema7 } from 'json-schema'

export enum QuestionType {
  Select = 'Select',
  TextArea = 'TextArea',
  Radio = 'Radio',
  Checkbox = 'Checkbox',
  Date = 'Date',
  DateDropdown = 'DateDropdown',
  CustomComponent = 'CustomComponent',
  Scoring = 'Scoring',
  Image = 'Image',
  Html = 'Html',
  Email = 'Email',
  Phone = 'Phone',
  Number = 'Number',
  Or = 'Or',
  InfoMessage = 'InfoMessage',
  InfoCard = 'InfoCard',
  VerificationCode = 'VerificationCode',
  RadioCards = 'RadioCards',
  CheckboxCards = 'CheckboxCards',
  ContactVerification = 'ContactVerification',
}
export interface IFormAggregated extends IForm {
  jsonSchema: JSONSchema7
  uiSchema: any
}
export interface IForm {
  id: string
  tenantId?: string
  name: string
  source: string
  version: string
  anonymous: boolean
  readonly submissionCount: number
  description?: string
  modifiedDate?: string
  status: 'Draft' | 'Published'
  // required for internal use
  sections?: IFormSection[]
  image?: string
  // required for internal use
  createdBy?: string
  createdDateTime?: string
  lastModifiedBy?: string
  lastModifiedDateTime?: string
  isDeleted?: boolean
}
export interface IFormQuestion {
  formId: string
  sectionId: string
  tenantId?: string
  id?: string
  customId?: string
  title: string
  description?: string
  type?: QuestionType
  required?: boolean
  defaultValue?: string
  validation?: {
    minLength?: number
    maxLength?: number
    /** Regex source applied to string values (e.g. phone number formats). */
    pattern?: string
    /** Inclusive lower bound for numeric (Number) questions. */
    minimum?: number
    /** Inclusive upper bound for numeric (Number) questions. */
    maximum?: number
  }
  /** When true, renders a multi-line text control (e.g. textarea) instead of a single-line input. */
  multiline?: boolean
  /** InfoMessage widget: bold lead-in shown before `text`. */
  preText?: string
  /** InfoMessage widget: body copy shown after `preText`. Or widget: separator text rendered in place of the title. */
  text?: string
  /** InfoMessage widget: paragraph rendered below the preText/text line and above the list. */
  body?: string
  /** Email/Phone widget: input placeholder text. */
  placeholder?: string
  /** InfoMessage/InfoCard/ContactVerification/RadioCards/CheckboxCards: Chakra style overrides for the container. */
  styles?: Record<string, unknown>
  /** InfoMessage widget: optional lines rendered as a bulleted list below the text. */
  list?: string[]
  /** InfoCard widget: optional emoji/icon shown before the card title. */
  icon?: string
  /** InfoCard widget: rich body blocks (paragraphs, lists, and label/value row groups) rendered in the card body. */
  content?: InfoCardContentBlock[]
  /** VerificationCode widget: number of digit inputs (defaults to 6). */
  codeLength?: number
  /** DateDropdown widget: earliest year offered in the Year dropdown. */
  minYear?: number
  /** DateDropdown widget: latest year offered in the Year dropdown. */
  maxYear?: number
  /** RadioCards widget: selectable cards (icon/title/description), each optionally with nested sub-items. */
  cards?: RadioCardItem[]
  /** ContactVerification widget: bold label shown above the email input (e.g. a masked email on file). */
  maskedEmailLabel?: string
  /** ContactVerification widget: bold label shown above the phone input (e.g. a masked phone on file). */
  maskedPhoneLabel?: string
  /** ContactVerification widget: separator text between the email and phone inputs (defaults to "or"). */
  orLabel?: string
  /** ContactVerification widget: the "Try Again" button — show defaults to true, text defaults to "Try Again". */
  tryButton?: {
    show?: boolean
    text?: string
  }
  options?: string[] // For select fields
  order?: number
  component?: IFormComponentOpts
  visibilityCondition?: IQuestionVisibilityCondition
  // internal use fields
  createdBy?: string
  createdDateTime?: string
  lastModifiedBy?: string
  lastModifiedDateTime?: string
  isDeleted?: boolean
}

/**
 * InfoCard widget: a rich body block rendered in the card body.
 * A paragraph of text, an ordered/unordered list of items, or a group of
 * label/value rows (label left, value right).
 */
export type InfoCardContentBlock =
  | { type: 'paragraph', text: string }
  | { type: 'list', ordered?: boolean, items: string[] }
  | { type: 'rows', rows: { label: string, value: string }[] }

/**
 * RadioCards widget: a single selectable card.
 * `value` is what gets stored in formData when the card is chosen; `subItems`
 * are nested cards revealed once the parent card (or one of its sub-items) is selected.
 */
export interface RadioCardItem {
  /** Value stored in formData when this card is selected. */
  value: string
  /** Bold card heading. */
  title: string
  /** Muted supporting copy shown below the title. */
  description?: string
  /** Optional emoji/icon shown in the leading badge. */
  icon?: string
  /** Nested cards revealed when this card (or one of its sub-items) is selected. */
  subItems?: RadioCardItem[]
}

export type ConditionOperator = 'equals' | 'notEquals'

export interface IQuestionVisibilityRule {
  fieldId: string
  operator: ConditionOperator
  value: string
}

export interface IQuestionVisibilityCondition {
  logic: 'AND' | 'OR'
  rules: IQuestionVisibilityRule[]
}

export interface IFormComponentOpts {
  type?: ComponentType
  componentId?: string

  // ---- Wwidget config (CustomComponent path) ----
  // For questions persisted as `type: CustomComponent`, the widget kind lives in `type` above
  // (InfoCard/InfoMessage/Or/VerificationCode/DateDropdown/Email/Phone/Number) and its
  // type-specific config lives in the fields below. shared-forms normalizes these back onto the
  // question (see normalizeQuestion in utils/form.ts) so the render pipeline is unchanged.
  /** InfoMessage: bold lead-in shown before `text`. */
  preText?: string
  /** InfoMessage: body copy shown after `preText`. Or: separator text rendered in place of the title. */
  text?: string
  /** InfoMessage: paragraph rendered below the preText/text line and above the list. */
  body?: string
  /** Email/Phone: input placeholder text. */
  placeholder?: string
  /** InfoMessage/InfoCard/ContactVerification/RadioCards/CheckboxCards: Chakra style overrides for the container. */
  styles?: Record<string, unknown>
  /** InfoMessage: optional lines rendered as a bulleted list below the text. */
  list?: string[]
  /** InfoCard: optional emoji/icon shown before the card title. */
  icon?: string
  /** InfoCard: rich body blocks (paragraphs, lists, and label/value row groups) rendered in the card body. */
  content?: InfoCardContentBlock[]
  /** VerificationCode: number of digit inputs (defaults to 6). */
  codeLength?: number
  /** DateDropdown: earliest year offered in the Year dropdown. */
  minYear?: number
  /** DateDropdown: latest year offered in the Year dropdown. */
  maxYear?: number
  /** RadioCards: selectable cards (icon/title/description), each optionally with nested sub-items. */
  cards?: RadioCardItem[]
  /** ContactVerification: bold label shown above the email input (e.g. a masked email on file). */
  maskedEmailLabel?: string
  /** ContactVerification: bold label shown above the phone input (e.g. a masked phone on file). */
  maskedPhoneLabel?: string
  /** ContactVerification: separator text between the email and phone inputs (defaults to "or"). */
  orLabel?: string
  /** ContactVerification: the "Try Again" button — show defaults to true, text defaults to "Try Again". */
  tryButton?: {
    show?: boolean
    text?: string
  }
  /** Email/Phone/VerificationCode: validation carried in the free-form blob (the service may not persist these on the question). */
  minLength?: number
  maxLength?: number
  /** Email/Phone: regex source applied to the string value. */
  pattern?: string
  /** Number: inclusive numeric bounds. */
  minimum?: number
  maximum?: number

  currentUser?: {
    id: string
    email: string
    firstName: string
    lastName: string
    source: string
  }
  staffClassifications?: string[]

  schoolId?: number | string
  schoolName?: string
  teacherName?: string
  staffUniqueId?: string
  sectionName?: string
  sectionId?: string
  courseId?: string

  // Nested structure from server (computed at runtime)
  schools?: {
    schoolId: number
    schoolName: string
    teachers?: {
      teacherName: string
      teacherEmail: string
      staffUniqueId: string
      sections?: {
        sectionName: string
        sectionId: string
        courseId: string
      }[]
    }[]
  }[]
  // Legacy flat arrays (for backward compatibility and uiSchema)
  sections?: {
    courseId: string
    sectionId: string
    sectionName: string
  }[]
  teachers?: {
    staffUniqueId: string
    teacherName: string
    teacherEmail: string
  }[]
}

export interface IFormSection {
  id?: string
  formId: string
  customId?: string
  title: string
  description?: string
  subHeading?: string
  // required for internal use
  questions?: IFormQuestion[]
  order: number
  image?: string
}

export interface IFormSubmission {
  id: string
  formId: string
  tenantId: string
  data: string
  name: string
  email: string
  createdDateTime: string
}

export enum ComponentType {
  CurrentUserName = 'CurrentUserName',
  SectionPicker = 'SectionPicker',
  // Widgets persisted via the CustomComponent path: the backend stores these as
  // `type: CustomComponent` with the widget kind + config nested in the free-form `component`
  // blob (no first-class QuestionType/proto/domain changes required on the service).
  InfoCard = 'InfoCard',
  InfoMessage = 'InfoMessage',
  Or = 'Or',
  VerificationCode = 'VerificationCode',
  DateDropdown = 'DateDropdown',
  Email = 'Email',
  Phone = 'Phone',
  Number = 'Number',
  RadioCards = 'RadioCards',
  CheckboxCards = 'CheckboxCards',
  ContactVerification = 'ContactVerification',
}
export function resolveComponentType(typeStr: string | undefined): ComponentType | undefined {
  switch (typeStr?.toString().toLowerCase()) {
    case 'currentusername':
      return ComponentType.CurrentUserName
    case 'sectionpicker':
      return ComponentType.SectionPicker
    case 'infocard':
      return ComponentType.InfoCard
    case 'infomessage':
      return ComponentType.InfoMessage
    case 'or':
      return ComponentType.Or
    case 'verificationcode':
      return ComponentType.VerificationCode
    case 'datedropdown':
      return ComponentType.DateDropdown
    case 'email':
      return ComponentType.Email
    case 'phone':
      return ComponentType.Phone
    case 'number':
      return ComponentType.Number
    case 'radiocards':
      return ComponentType.RadioCards
    case 'checkboxcards':
      return ComponentType.CheckboxCards
    case 'contactverification':
      return ComponentType.ContactVerification
    default:
      return undefined
  }
}

export interface IFormComponentUi {
  componentId?: string
  type?: ComponentType
  namespace?: string
  roles?: string[]
  schoolId?: 0
  schoolName?: string
  teacherName?: string
  teacherEmail?: string
  staffUniqueId?: string
  sectionName?: string
  sectionId?: string
  courseId?: string
}
export interface IFormComponent {
  id: string
  displayName: string
  type: ComponentType
}

export interface IFormAccessControl {
  id?: string
  tenantId: string
  targetAudience: 'Unknown' | 'Anyone' | 'AnyoneInTenant' | 'UsersWithRoleInTenant' | 'SpecificUsersInTenant'
  singleResponsePerIndividual: boolean
  staffClassifications?: string[]
  users?: string[]
}
