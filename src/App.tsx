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
import { Provider, sectionDomainRecipe, errorListRecipe, conditionalFieldRecipe, checkboxFieldRecipe, textFieldRecipe, infoMessageRecipe, scoringFieldRecipe, infoCardRecipe } from './ui'
import type { RecipesRegistry, SlotRecipesRegistry } from './ui'
import { ThemeEditorPanel, useThemeEditorState } from './theme-editor'
import { aggregateForm } from './utils/form'
import React from 'react'
import { humanizeRjsfErrors } from './utils'
import { createConditionalRequiredCustomValidate } from './utils/conditionalRequiredValidate'
import sampleForm from "./sample-form"
import { Button, Flex, Text } from '@chakra-ui/react'
const { form, sections, questions } = sampleForm

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

  const themeEditor = useThemeEditorState(getRecipeOverrides(), getSlotRecipeOverrides())
  const [editorMode, setEditorMode] = useState(true)

  return (
    <Provider
      recipes={themeEditor.recipes}
      slotRecipes={themeEditor.slotRecipes}>
      <Flex flexDir='column' w='250px'>
        <Button 
          bg='white' 
          color='black'
          border='1px solid lightgray'
          fontWeight='bold'
          width='100%'
          onClick={() => setEditorMode(!editorMode)}>
            {editorMode? "Dev 🟢" : "Editor 🔵"}
        </Button>
        <Button
          mt='16px'
          colorScheme="blue"
          onClick={toggleDarkMode}>Toggle Dark Mode</Button>
      </Flex>
      <Flex>
          { !editorMode && <Form
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
            templates={customTemplates} /> }

          { editorMode && <ThemeEditorPanel
            recipes={themeEditor.recipes}
            slotRecipes={themeEditor.slotRecipes}
            onRecipeChange={themeEditor.setRecipeOverride}
            onSlotRecipeChange={themeEditor.setSlotRecipeOverride}
            onReset={themeEditor.reset}
            onResetComponent={themeEditor.resetEntries} /> }

          { !editorMode && <Flex 
            flexDir='column'
            border='1px solid lightgray'
            padding='20px'>
            <Text fontWeight='bold'>Sample Response Output</Text>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </Flex> }
      </Flex>
    </Provider>
  )
}

export default App

// Methods
function toggleDarkMode() {
  const isDarkMode = localStorage.getItem("selectedDarkMode") === "true"
  localStorage.setItem("selectedDarkMode", isDarkMode ? "false" : "true")
  window.location.reload()
}

const brandSectionDomainOverride: SlotRecipesRegistry['sectionDomain'] = {
  ...sectionDomainRecipe,
  base: {
    ...sectionDomainRecipe.base,
    root: {
      borderRadius: 'sm',
      borderWidth: '0'
    },
    header: {
      ...sectionDomainRecipe.base?.header,
      bg: 'blue.100',
      _dark: { bg: 'purple.800' },
    },
    heading: {
      ...sectionDomainRecipe.base?.heading,
      color: 'black',
    },
    subHeading: {
      color: "green",
      bg: 'white'
    },
    description: {
      ...sectionDomainRecipe.base?.description,
      color: 'black',
    },
  },
}

const brandSubmitButtonOverride: RecipesRegistry['submitButton'] = {
  base: {
    bg: 'purple.700',
    _dark: { bg: 'purple.800', borderColor: 'purple.500' },
  },
}

const objectFieldCustomContainerOverride: RecipesRegistry['objectFieldCustomContainer'] = {
  base: {
    borderBottom: '10px solid',
    borderColor: 'gray.200',
  }
}

const brandFieldErrorOverride: RecipesRegistry['fieldError'] = {
  base: {
    color: 'red.800',
    _dark: { color: 'purple.300' },
  },
}

const brandTitleHeadingOverride: RecipesRegistry['titleHeading'] = {
  base: {
    color: 'red.500',
    _dark: { color: 'purple.100' },
  },
}

const brandFormDescriptionOverride: RecipesRegistry['formDescription'] = {
  base: {
    color: 'blue.800',
    _dark: { color: 'purple.200' },
  },
}

const brandErrorListOverride: SlotRecipesRegistry['errorList'] = {
  ...errorListRecipe,
  base: {
    ...errorListRecipe.base,
    container: {
      ...errorListRecipe.base?.container,
      borderColor: 'purple.300',
      bg: 'purple.50',
      _dark: { borderColor: 'purple.700', bg: 'purple.950' },
    },
    heading: {
      ...errorListRecipe.base?.heading,
      color: 'purple.700',
      _dark: { color: 'purple.200' },
    },
  },
}

const brandConditionalFieldOverride: SlotRecipesRegistry['conditionalField'] = {
  ...conditionalFieldRecipe,
  base: {
    ...conditionalFieldRecipe.base,
    label: {
      ...conditionalFieldRecipe.base?.label,
      color: 'purple.700',
      _dark: { color: 'purple.200' },
    },
  },
}

const brandIconBadgeOverride: RecipesRegistry['iconBadge'] = {
  base: {
    bg: 'purple.500',
  },
}

const brandCheckboxFieldOverride: SlotRecipesRegistry['checkboxField'] = {
  ...checkboxFieldRecipe,
  base: {
    ...checkboxFieldRecipe.base,
    control: {
      ...checkboxFieldRecipe.base?.control,
      colorPalette: 'purple',
    },
  },
}

// Widget recipe example (plain `recipe`) — textFieldRecipe backs InputFieldWidget, EmailFieldWidget,
// PhoneFieldWidget and NumberFieldWidget, so overriding it re-skins all of them at once.
const brandTextFieldOverride: RecipesRegistry['textField'] = {
  base: {
    ...textFieldRecipe.base,
    borderRadius: '10px',
    _dark: { ...textFieldRecipe.base?._dark, bg: 'purple.950' },
  },
}

// Widget recipe example (plain `recipe`) — infoMessageRecipe backs InfoMessageWidget.
const brandInfoMessageOverride: RecipesRegistry['infoMessage'] = {
  base: {
    ...infoMessageRecipe.base,
    bg: 'purple.50',
    borderLeft: '4px solid',
    borderColor: 'purple.500',
    _dark: { bg: 'purple.950', borderColor: 'purple.400' },
  },
}

// Widget slot recipe example (`slot recipe`) — scoringFieldRecipe backs ScoringFieldWidget.
const brandScoringFieldOverride: SlotRecipesRegistry['scoringField'] = {
  ...scoringFieldRecipe,
  base: {
    ...scoringFieldRecipe.base,
    header: {
      ...scoringFieldRecipe.base?.header,
      color: 'purple.700',
      _dark: { color: 'purple.200' },
    },
  },
}

const brandInfoCardOverride: SlotRecipesRegistry['infoCard'] = {
  ...infoCardRecipe,
  base: {
    ...infoCardRecipe.base,
    container: {
      ...infoCardRecipe.base?.container,
      borderColor: 'purple.300',
      _dark: { bg: 'purple.950', borderColor: 'purple.700' },
    },
    title: {
      ...infoCardRecipe.base?.title,
      color: 'purple.700',
      _dark: { color: 'purple.200' },
    },
  },
}

function getRecipeOverrides() {
  const recipeOverrides: Partial<RecipesRegistry> = {
    fieldError: brandFieldErrorOverride,
    submitButton: brandSubmitButtonOverride,
    titleHeading: brandTitleHeadingOverride,
    formDescription: brandFormDescriptionOverride,
    objectFieldCustomContainer: objectFieldCustomContainerOverride,
    iconBadge: brandIconBadgeOverride,
    textField: brandTextFieldOverride,
    infoMessage: brandInfoMessageOverride,
  }

  return recipeOverrides
}

function getSlotRecipeOverrides() {
  const slotRecipeOverrides: Partial<SlotRecipesRegistry> = {
    sectionDomain: brandSectionDomainOverride,
    errorList: brandErrorListOverride,
    conditionalField: brandConditionalFieldOverride,
    checkboxField: brandCheckboxFieldOverride,
    scoringField: brandScoringFieldOverride,
    infoCard: brandInfoCardOverride,
  }

  return slotRecipeOverrides
}

interface Props {
  form?: IFormAggregated
  readonly?: boolean
  data?: any
  onSubmit?: (data: any) => void
}
