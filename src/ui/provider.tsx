import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
  mergeConfigs,
} from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import type { ColorModeProviderProps } from './color-mode'
import { colors } from './theme'
import { sectionDomainRecipe } from './recipes/section-domain'
import { fieldErrorRecipe } from './recipes/field-error'
import { errorListRecipe } from './recipes/error-list'
import { submitButtonRecipe } from './recipes/submit-button'
import { titleHeadingRecipe } from './recipes/title-heading'
import { formDescriptionRecipe } from './recipes/form-description'
import { objectFieldCustomContainerRecipe } from './recipes/object-field-custom'
import { conditionalFieldRecipe } from './recipes/conditional-field'
import { fieldHeaderRecipe } from './recipes/field-header'
import { textFieldRecipe } from './recipes/text-field'
import { selectControlRecipe } from './recipes/select-control'
import { iconBadgeRecipe } from './recipes/icon-badge'
import { infoMessageRecipe } from './recipes/info-message'
import { verificationCodeRecipe } from './recipes/verification-code'
import { checkboxFieldRecipe } from './recipes/checkbox-field'
import { radioFieldRecipe } from './recipes/radio-field'
import { choiceCardRecipe } from './recipes/choice-card'
import { inputHintRecipe } from './recipes/input-hint'
import { dividerFieldRecipe } from './recipes/divider-field'
import { scoringFieldRecipe } from './recipes/scoring-field'
import { infoCardRecipe } from './recipes/info-card'
import { contactVerificationRecipe } from './recipes/contact-verification'
import { imageFieldRecipe } from './recipes/image-field'
import { sectionPickerRecipe } from './recipes/section-picker'
import { dateDropdownRecipe } from './recipes/date-dropdown'

/**
 * Keyed by the package's actual recipe consts (via `typeof`) rather than a loose
 * `Record<string, RecipeDefinition>`, so consumers get key-name autocomplete/typo
 * checking plus each recipe's own variant shape (e.g. titleHeading's
 * `variant: 'standalone' | 'root'`) — and it stays in sync automatically if a
 * recipe's variants change, since nothing here is hand-duplicated.
 */
export interface RecipesRegistry {
  fieldError: typeof fieldErrorRecipe
  submitButton: typeof submitButtonRecipe
  titleHeading: typeof titleHeadingRecipe
  formDescription: typeof formDescriptionRecipe
  objectFieldCustomContainer: typeof objectFieldCustomContainerRecipe
  fieldHeader: typeof fieldHeaderRecipe
  textField: typeof textFieldRecipe
  selectControl: typeof selectControlRecipe
  iconBadge: typeof iconBadgeRecipe
  infoMessage: typeof infoMessageRecipe
  verificationCode: typeof verificationCodeRecipe
}

export interface SlotRecipesRegistry {
  sectionDomain: typeof sectionDomainRecipe
  errorList: typeof errorListRecipe
  conditionalField: typeof conditionalFieldRecipe
  checkboxField: typeof checkboxFieldRecipe
  radioField: typeof radioFieldRecipe
  choiceCard: typeof choiceCardRecipe
  inputHint: typeof inputHintRecipe
  dividerField: typeof dividerFieldRecipe
  scoringField: typeof scoringFieldRecipe
  infoCard: typeof infoCardRecipe
  contactVerification: typeof contactVerificationRecipe
  imageField: typeof imageFieldRecipe
  sectionPicker: typeof sectionPickerRecipe
  dateDropdown: typeof dateDropdownRecipe
}

export type ProviderRecipes = Partial<RecipesRegistry>
export type ProviderSlotRecipes = Partial<SlotRecipesRegistry>

export interface ProviderProps extends ColorModeProviderProps {
  /**
   * Override or extend the package's single-part recipes (fieldError, submitButton,
   * titleHeading, formDescription, objectFieldCustomContainer, fieldHeader, textField,
   * selectControl, iconBadge, infoMessage, verificationCode). Unset keys fall back to
   * the package defaults; a partial recipe (e.g. just `{ base: { color: 'purple.600' } }`)
   * is deep-merged on top of the default rather than replacing it outright.
   */
  recipes?: ProviderRecipes
  /**
   * Override or extend the package's slot recipes (sectionDomain, errorList,
   * conditionalField, checkboxField, radioField, choiceCard, inputHint, dividerField,
   * scoringField, infoCard, contactVerification, imageField, sectionPicker,
   * dateDropdown). Same merge behavior as `recipes`.
   */
  slotRecipes?: ProviderSlotRecipes
}

export function Provider({ recipes, slotRecipes, ...props }: ProviderProps) {
  console.log('recipes', recipes)
  console.log('recipeslots', slotRecipes)

  const baseTheme = defineConfig({
    theme: {
      semanticTokens: {
        colors: {
          primary: { value: colors.primary.DEFAULT },
          accent: { value: colors.accent.DEFAULT },
          success: { value: colors.success.DEFAULT },
          info: { value: colors.info.DEFAULT },
          warning: { value: colors.bg.DEFAULT },
          error: { value: colors.error.DEFAULT },
        },
      },
      recipes: {
        fieldError: fieldErrorRecipe,
        submitButton: submitButtonRecipe,
        titleHeading: titleHeadingRecipe,
        formDescription: formDescriptionRecipe,
        objectFieldCustomContainer: objectFieldCustomContainerRecipe,
        fieldHeader: fieldHeaderRecipe,
        textField: textFieldRecipe,
        selectControl: selectControlRecipe,
        iconBadge: iconBadgeRecipe,
        infoMessage: infoMessageRecipe,
        verificationCode: verificationCodeRecipe,
      },
      slotRecipes: {
        sectionDomain: sectionDomainRecipe,
        errorList: errorListRecipe,
        conditionalField: conditionalFieldRecipe,
        checkboxField: checkboxFieldRecipe,
        radioField: radioFieldRecipe,
        choiceCard: choiceCardRecipe,
        inputHint: inputHintRecipe,
        dividerField: dividerFieldRecipe,
        scoringField: scoringFieldRecipe,
        infoCard: infoCardRecipe,
        contactVerification: contactVerificationRecipe,
        imageField: imageFieldRecipe,
        sectionPicker: sectionPickerRecipe,
        dateDropdown: dateDropdownRecipe,
      },
    },
  })

  const theme = (recipes || slotRecipes)
    ? mergeConfigs(baseTheme, defineConfig({ theme: { recipes, slotRecipes } }))
    : baseTheme

  const isDarkMode = localStorage.getItem("selectedDarkMode") === "true"
  const system = createSystem(defaultConfig, theme)

  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} defaultTheme={isDarkMode ? "dark" : "light"} />
    </ChakraProvider>
  )
}
