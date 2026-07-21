import '@fontsource/open-sans/400-italic.css'
import '@fontsource/open-sans/400.css'
import '@fontsource/open-sans/600.css'
import '@fontsource/open-sans/700.css'
import '@fontsource/open-sans/800.css'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/600-italic.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import Form from '@rjsf/chakra-ui'
import { RegistryFieldsType, RegistryWidgetsType, RJSFValidationError } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import { useEffect, useState } from 'react'
import TitleFieldTemplate from './components/templates/TitleFieldTemplate'
import { ComponentType, IForm, IFormAggregated, IFormComponent, IFormQuestion, IFormSection } from './models/form'
import { CustomFieldTemplate, DescriptionFieldTemplate, ErrorListTemplate, FieldErrorTemplate, ObjectFieldTemplate, SubmitButton } from './components/templates'
import { CheckboxCardsField, ContactVerificationField, CurrentUserName, DateDropdownWidget, DateFieldWidget, EmailFieldWidget, HtmlFieldWidget, ImageFieldWidget, InfoCardWidget, InfoMessageWidget, InputFieldWidget, NumberFieldWidget, OrFieldWidget, PhoneFieldWidget, RadioCardsField, RadioFieldWidget, ScoringFieldWidget, SectionPicker, SelectFieldWidget, VerificationCodeWidget } from './components/widgets'
import { Provider } from './ui'
import { aggregateForm } from './utils/form'
import React from 'react'
import { humanizeRjsfErrors } from './utils'
import { createConditionalRequiredCustomValidate } from './utils/conditionalRequiredValidate'
import sampleForm from "./sample-form"
import { Button } from '@chakra-ui/react'
const { form, sections, questions } = sampleForm

function toggleDarkMode() {
  const isDarkMode = localStorage.getItem("selectedDarkMode") === "true"
  localStorage.setItem("selectedDarkMode", isDarkMode ? "false" : "true")
  window.location.reload()
}

interface Props {
  form?: IFormAggregated
  readonly?: boolean
  data?: any
  onSubmit?: (data: any) => void
}

function App(props: Props) {
  const components: IFormComponent[] = [
    {
      "id": "2f4ad6e3-9ae8-4f83-acec-61b5497a44c1",
      "displayName": "Section Picker",
      "type": ComponentType.SectionPicker,
    },
    {
      "id": "333c1028-f168-444b-bb73-bf9d40e718a5",
      "displayName": "Current User",
      "type": ComponentType.CurrentUserName,
    }
  ]

  const customTemplates = {
    FieldTemplate: CustomFieldTemplate,
    ObjectFieldTemplate,
    TitleFieldTemplate,
    ButtonTemplates: { SubmitButton },
    DescriptionFieldTemplate,
    ErrorListTemplate,
    FieldErrorTemplate,
  }

  const customWidgets: RegistryWidgetsType = {
    InputFieldWidget,
    TextareaWidget: InputFieldWidget,
    SelectWidget: SelectFieldWidget,
    RadioWidget: RadioFieldWidget,
    ScoringWidget: ScoringFieldWidget,
    ImageWidget: ImageFieldWidget,
    HtmlWidget: HtmlFieldWidget,
    InfoCardWidget,
    InfoMessageWidget,
    EmailWidget: EmailFieldWidget,
    PhoneWidget: PhoneFieldWidget,
    NumberWidget: NumberFieldWidget,
    OrWidget: OrFieldWidget,
    VerificationCodeWidget,
    DateDropdownWidget,
    text: InputFieldWidget,
    email: EmailFieldWidget,
    date: DateFieldWidget,
    CurrentUserName,
  }

  const customFields: RegistryFieldsType = { SectionPicker, RadioCardsField, CheckboxCardsField, ContactVerificationField } as RegistryFieldsType

  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [schema, setSchema] = useState({})
  const [uiSchema, setUiSchema] = useState({})

  useEffect(() => {
    const result = aggregateForm(form as IForm, sections as IFormSection[], questions as Record<string, IFormQuestion[]>, components as IFormComponent[])
    setSchema(result.jsonSchema)
    setUiSchema(result.uiSchema)
  }, [])

  // console.log("json schema", schema)
  // console.log("ui schema", uiSchema)

  // console.log("formData", formData)

  const customValidate = React.useMemo(
    () => createConditionalRequiredCustomValidate(schema),
    [schema],
  )

  const uiSchemaWithReadOnly = React.useMemo(() => {
    if (props.readonly) {
      return {
        ...uiSchema,
        'ui:disabled': true,
        'ui:submitButtonOptions': { norender: true },
      }
    }
    return uiSchema
  }, [props.readonly, uiSchema])

  const transformErrors = React.useCallback(
    (errors: RJSFValidationError[]) =>
      humanizeRjsfErrors(errors, uiSchemaWithReadOnly, schema),
    [schema, uiSchemaWithReadOnly],
  )

  const [formContext, setFormContext] = useState({ 
    formData, 
    maskedEmail: "elv**@gmail.com", 
    onExecuteAction
  })

  function onExecuteAction(action: 'contact-verification:retry', value: any) {
    console.log("actionId", action, value)
  }

  return (
    <div>
      Form:
      <Provider>
        <Button
          onClick={toggleDarkMode} colorScheme="blue">Toggle Dark Mode</Button>
        <Form
          noHtml5Validate={true}
          focusOnFirstError={true}
          formData={formData}
          onChange={e => setFormData(e.formData)}
          onSubmit={() => console.log("formData", formData)}
          formContext={formContext}
          schema={schema}
          uiSchema={uiSchemaWithReadOnly}
          validator={validator}
          transformErrors={transformErrors}
          customValidate={customValidate}
          widgets={customWidgets}
          fields={customFields}
          templates={customTemplates} />
      </Provider>
      <div className="debugbox">
        <h3>Sample Response Output</h3>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </div>
  )
}

export default App