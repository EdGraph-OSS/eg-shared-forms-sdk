import { Component, useState } from 'react'
import type { ReactNode } from 'react'
import { Box, Input, Text } from '@chakra-ui/react'
import {
  CheckboxCardsField,
  CheckboxFieldWidget,
  ContactVerificationField,
  CurrentUserName,
  DateDropdownWidget,
  DateFieldWidget,
  EmailFieldWidget,
  ImageFieldWidget,
  InfoCardWidget,
  InfoMessageWidget,
  InputFieldWidget,
  NumberFieldWidget,
  OrFieldWidget,
  PhoneFieldWidget,
  RadioCardsField,
  RadioFieldWidget,
  ScoringFieldWidget,
  SectionPicker,
  SelectFieldWidget,
  VerificationCodeWidget,
} from '../components/widgets'
import {
  CustomFieldTemplate,
  ErrorListTemplate,
  FieldErrorTemplate,
  ObjectFieldTemplate,
  SubmitButton,
  TitleFieldTemplate,
} from '../components/templates'

const noop = () => {}

/** Sample data shared across a handful of previews below. */
const ENUM_OPTIONS = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
]

const CARD_ITEMS = [
  { value: 'email', title: 'Email', description: 'Get updates by email', icon: '✉️' },
  { value: 'sms', title: 'SMS', description: 'Get updates by text', icon: '📱' },
]

const SCHOOL_OPTIONS = [
  {
    schoolId: 1,
    schoolName: 'Lincoln Elementary',
    teachers: [
      {
        teacherName: 'Jane Smith',
        teacherEmail: 'jane.smith@example.edu',
        staffUniqueId: 'T-1001',
        sections: [
          { sectionName: 'Homeroom A', sectionId: 'S-1', courseId: 'C-1' },
        ],
      },
    ],
  },
]

const SAMPLE_IMAGE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="160">'
  + '<rect width="100%" height="100%" fill="#cbd5e1"/>'
  + '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#334155">Sample Image</text>'
  + '</svg>'
const SAMPLE_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(SAMPLE_IMAGE_SVG)}`

function PreviewCheckboxCardsField() {
  const [formData, setFormData] = useState<Record<string, boolean>>({})
  return (
    <CheckboxCardsField {...({
      uiSchema: { 'ui:header': 'Notification preferences', 'ui:options': { cards: CARD_ITEMS } },
      formData,
      onChange: (next: Record<string, boolean> | undefined) => setFormData(next ?? {}),
      fieldPathId: { path: [] },
      rawErrors: [],
      disabled: false,
      readonly: false,
    } as any)}
    />
  )
}

function PreviewCheckboxFieldWidget() {
  const [value, setValue] = useState<string[]>([])
  return (
    <CheckboxFieldWidget {...({
      id: 'preview-checkbox',
      options: { enumOptions: ENUM_OPTIONS },
      value,
      onChange: setValue,
      rawErrors: [],
      uiSchema: { 'ui:header': 'Favorite colors' },
      required: false,
      readonly: false,
    } as any)}
    />
  )
}

function PreviewContactVerificationField() {
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  return (
    <ContactVerificationField {...({
      uiSchema: {
        'ui:options': {
          title: 'Verify your contact info',
          icon: '🔒',
          maskedEmailLabel: 'Confirm the email we have on file:',
          maskedPhoneLabel: 'Confirm the phone we have on file:',
        },
      },
      schema: { title: 'Contact Verification' },
      formData,
      onChange: (next: Record<string, unknown>) => setFormData(next),
      fieldPathId: { path: [] },
      errorSchema: {},
      registry: {
        formContext: {
          maskedEmail: 'jo**@example.com',
          maskedPhone: '***-***-1234',
          onExecuteAction: noop,
        },
      },
      disabled: false,
      readonly: false,
    } as any)}
    />
  )
}

function PreviewCurrentUserName() {
  return (
    <CurrentUserName {...({
      name: 'preview-current-user',
      value: 'Jordan Lee',
      defaultValue: 'Jordan Lee',
      onChange: noop,
      rawErrors: [],
      uiSchema: { 'ui:header': 'Signed in as' },
    } as any)}
    />
  )
}

function PreviewDateDropdownWidget() {
  const [value, setValue] = useState<string | undefined>(undefined)
  return (
    <DateDropdownWidget {...({
      name: 'preview-date-dropdown',
      value,
      onChange: setValue,
      options: { minYear: 2000, maxYear: 2030 },
      rawErrors: [],
      uiSchema: { 'ui:header': 'Date of birth' },
      disabled: false,
      readonly: false,
    } as any)}
    />
  )
}

function PreviewDateFieldWidget() {
  const [value, setValue] = useState<string | undefined>(undefined)
  return (
    <DateFieldWidget {...({
      name: 'preview-date',
      value,
      onChange: setValue,
      uiSchema: { 'ui:header': 'Appointment date' },
      readonly: false,
    } as any)}
    />
  )
}

function PreviewEmailFieldWidget() {
  const [value, setValue] = useState('')
  return (
    <EmailFieldWidget {...({
      name: 'preview-email',
      value,
      onChange: (next: string | undefined) => setValue(next ?? ''),
      placeholder: 'you@example.com',
      rawErrors: [],
      uiSchema: { 'ui:header': 'Email address' },
      readonly: false,
    } as any)}
    />
  )
}

function PreviewImageFieldWidget() {
  return (
    <ImageFieldWidget {...({
      id: 'preview-image',
      value: SAMPLE_IMAGE,
      schema: { default: SAMPLE_IMAGE, title: 'Illustration', description: 'A helpful illustration.' },
      uiSchema: {},
    } as any)}
    />
  )
}

function PreviewInfoCardWidget() {
  return (
    <InfoCardWidget {...({
      options: {
        title: 'Student Information',
        icon: '📋',
        content: [
          { type: 'rows', rows: [{ label: 'Name:', value: 'Jordan Lee' }, { label: 'Grade:', value: '5th' }] },
        ],
      },
    } as any)}
    />
  )
}

function PreviewInfoMessageWidget() {
  return (
    <InfoMessageWidget {...({
      options: {
        preText: '🔒 Your privacy matters:',
        text: 'This information is used only for verification.',
      },
    } as any)}
    />
  )
}

function PreviewInputFieldWidget() {
  const [value, setValue] = useState('')
  return (
    <InputFieldWidget {...({
      name: 'preview-input',
      value,
      onChange: (next: string | undefined) => setValue(next ?? ''),
      schema: { minLength: 0, maxLength: 120 },
      options: {},
      rawErrors: [],
      uiSchema: { 'ui:header': 'Full name' },
      readonly: false,
    } as any)}
    />
  )
}

function PreviewNumberFieldWidget() {
  const [value, setValue] = useState<number | undefined>(undefined)
  return (
    <NumberFieldWidget {...({
      name: 'preview-number',
      value,
      onChange: setValue,
      schema: { type: 'number', minimum: 0, maximum: 100 },
      rawErrors: [],
      uiSchema: { 'ui:header': 'Age' },
      readonly: false,
    } as any)}
    />
  )
}

function PreviewOrFieldWidget() {
  return <OrFieldWidget {...({ uiSchema: { 'ui:options': { label: 'or' } } } as any)} />
}

function PreviewPhoneFieldWidget() {
  const [value, setValue] = useState('')
  return (
    <PhoneFieldWidget {...({
      name: 'preview-phone',
      value,
      onChange: (next: string | undefined) => setValue(next ?? ''),
      placeholder: '(555) 555-5555',
      rawErrors: [],
      uiSchema: { 'ui:header': 'Phone number' },
      readonly: false,
    } as any)}
    />
  )
}

function PreviewRadioCardsField() {
  const [formData, setFormData] = useState<Record<string, boolean>>({})
  return (
    <RadioCardsField {...({
      uiSchema: { 'ui:header': 'Preferred contact method', 'ui:options': { cards: CARD_ITEMS } },
      formData,
      onChange: (next: Record<string, boolean> | undefined) => setFormData(next ?? {}),
      fieldPathId: { path: [] },
      rawErrors: [],
      disabled: false,
      readonly: false,
    } as any)}
    />
  )
}

function PreviewRadioFieldWidget() {
  const [value, setValue] = useState('')
  return (
    <RadioFieldWidget {...({
      id: 'preview-radio',
      options: { enumOptions: ENUM_OPTIONS },
      value,
      onChange: setValue,
      rawErrors: [],
      uiSchema: { 'ui:header': 'Favorite color' },
      required: false,
      readonly: false,
    } as any)}
    />
  )
}

function PreviewScoringFieldWidget() {
  const [value, setValue] = useState('')
  return (
    <ScoringFieldWidget {...({
      id: 'preview-score',
      options: {},
      value,
      onChange: setValue,
      rawErrors: [],
      uiSchema: { 'ui:header': 'Rate your experience' },
      required: false,
      readonly: false,
    } as any)}
    />
  )
}

function PreviewSectionPicker() {
  const [formData, setFormData] = useState<Record<string, unknown>>({ section: {} })
  return (
    <SectionPicker {...({
      name: 'section',
      schema: { title: 'Section' },
      uiSchema: { 'ui:options': { schools: SCHOOL_OPTIONS } },
      formData,
      value: formData.section,
      onChange: (updated: Record<string, unknown>) => setFormData(updated),
      fieldPathId: { path: ['section'] },
      errorSchema: {},
      rawErrors: [],
      readonly: false,
    } as any)}
    />
  )
}

function PreviewSelectFieldWidget() {
  const [value, setValue] = useState('')
  return (
    <SelectFieldWidget {...({
      id: 'preview-select',
      options: { enumOptions: ENUM_OPTIONS },
      value,
      onChange: setValue,
      onBlur: noop,
      onFocus: noop,
      rawErrors: [],
      schema: {},
      uiSchema: {},
      placeholder: 'Choose a color',
      required: false,
      disabled: false,
      readonly: false,
    } as any)}
    />
  )
}

function PreviewVerificationCodeWidget() {
  const [value, setValue] = useState('')
  return (
    <VerificationCodeWidget {...({
      value,
      onChange: (next: string | undefined) => setValue(next ?? ''),
      options: { length: 6 },
      rawErrors: [],
      uiSchema: { 'ui:header': 'Enter the code we sent you' },
      disabled: false,
      readonly: false,
    } as any)}
    />
  )
}

function PreviewCustomFieldTemplate() {
  return (
    <CustomFieldTemplate {...({
      label: 'Sample Field',
      description: 'Helper text for this field.',
      required: true,
      errors: null,
      help: null,
      style: {},
      schema: { type: 'string' },
      uiSchema: { 'ui:widget': 'text' },
      registry: { formContext: {} },
      children: <Input placeholder="Field control" minW="300px" />,
    } as any)}
    />
  )
}

function PreviewErrorListTemplate() {
  return (
    <ErrorListTemplate {...({
      errors: [
        { stack: 'email: is a required property' },
        { stack: 'phone: must match the expected pattern' },
      ],
    } as any)}
    />
  )
}

function PreviewFieldErrorTemplate() {
  return (
    <FieldErrorTemplate {...({
      errors: ['This field is required.', 'Must be a valid value.'],
    } as any)}
    />
  )
}

function PreviewObjectFieldTemplate() {
  const schema = { type: 'object' }
  return (
    <ObjectFieldTemplate {...({
      schema,
      uiSchema: {},
      registry: { rootSchema: {} },
      title: 'Section Title',
      description: 'Section description text goes here.',
      properties: [
        { name: 'field1', content: <Box p={2} borderWidth="1px" borderRadius="md">Field 1</Box> },
        { name: 'field2', content: <Box p={2} borderWidth="1px" borderRadius="md">Field 2</Box> },
      ],
    } as any)}
    />
  )
}

function PreviewSubmitButton() {
  return <SubmitButton {...({ uiSchema: {}, readonly: false } as any)} />
}

function PreviewTitleFieldTemplate() {
  return <TitleFieldTemplate {...({ id: 'preview-title', title: 'Section Title', required: true } as any)} />
}

const PREVIEW_COMPONENTS: Record<string, () => ReactNode> = {
  CheckboxCardsField: PreviewCheckboxCardsField,
  CheckboxFieldWidget: PreviewCheckboxFieldWidget,
  ContactVerificationField: PreviewContactVerificationField,
  CurrentUserName: PreviewCurrentUserName,
  DateDropdownWidget: PreviewDateDropdownWidget,
  DateFieldWidget: PreviewDateFieldWidget,
  EmailFieldWidget: PreviewEmailFieldWidget,
  ImageFieldWidget: PreviewImageFieldWidget,
  InfoCardWidget: PreviewInfoCardWidget,
  InfoMessageWidget: PreviewInfoMessageWidget,
  InputFieldWidget: PreviewInputFieldWidget,
  NumberFieldWidget: PreviewNumberFieldWidget,
  OrFieldWidget: PreviewOrFieldWidget,
  PhoneFieldWidget: PreviewPhoneFieldWidget,
  RadioCardsField: PreviewRadioCardsField,
  RadioFieldWidget: PreviewRadioFieldWidget,
  ScoringFieldWidget: PreviewScoringFieldWidget,
  SectionPicker: PreviewSectionPicker,
  SelectFieldWidget: PreviewSelectFieldWidget,
  VerificationCodeWidget: PreviewVerificationCodeWidget,
  CustomFieldTemplate: PreviewCustomFieldTemplate,
  ErrorListTemplate: PreviewErrorListTemplate,
  FieldErrorTemplate: PreviewFieldErrorTemplate,
  ObjectFieldTemplate: PreviewObjectFieldTemplate,
  SubmitButton: PreviewSubmitButton,
  TitleFieldTemplate: PreviewTitleFieldTemplate,
}

interface PreviewBoundaryState {
  error: Error | null
}

/** Keeps one broken preview from taking down the whole editor panel. */
class PreviewBoundary extends Component<{ resetKey: string, children: ReactNode }, PreviewBoundaryState> {
  state: PreviewBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidUpdate(prevProps: { resetKey: string }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null })
    }
  }

  render() {
    if (this.state.error) {
      return (
        <Text fontSize="sm" color="red.500">
          Preview failed to render: {this.state.error.message}
        </Text>
      )
    }
    return this.props.children
  }
}

interface ComponentPreviewProps {
  name: string
}

export function ComponentPreview({ name }: ComponentPreviewProps) {
  const Preview = PREVIEW_COMPONENTS[name]
  if (!Preview) {
    return (
      <Text fontSize="sm" color="gray.500">
        No live preview available for this component.
      </Text>
    )
  }

  return (
    <PreviewBoundary resetKey={name}>
      <Preview />
    </PreviewBoundary>
  )
}
