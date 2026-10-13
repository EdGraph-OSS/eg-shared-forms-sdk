import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
  mergeConfigs,
} from '@chakra-ui/react'
import type { SystemStyleObject } from '@chakra-ui/react'
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

/**
 * Class of the element the Provider wraps its children in. Chakra's reset (preflight) and its
 * global styles are scoped to it, so they style the form without reaching the host page.
 */
const SCOPE_CLASS = 'eg-shared-forms'
const SCOPE = `.${SCOPE_CLASS}`
// Prefix for rules aimed at the wrapper's descendants. `:where()` adds no specificity, so a scoped
// reset rule such as `button { background-color: transparent }` ranks exactly as Chakra's
// unscoped one would, and never outranks a recipe's class selector.
const WITHIN_SCOPE = `:where(${SCOPE})`

/**
 * Re-targets Chakra's default global styles from the document (`html`, `*`) to the Provider's
 * wrapper and its descendants. The wrapper itself is `display: contents`, so it adds no box to
 * the host's layout while its inherited styles (colour, line height, fonts) still cascade.
 */
function scopeGlobalCss(globalCss: Record<string, SystemStyleObject>) {
  return Object.fromEntries(Object.entries(globalCss).map(([selector, styles]) => {
    if (selector === 'html') {
      return [SCOPE, { ...styles, display: 'contents' }]
    }
    const scoped = selector.split(',').map(part => `${WITHIN_SCOPE} ${part.trim()}`)
    return [(selector === '*' ? [SCOPE, ...scoped] : scoped).join(', '), styles]
  }))
}

export function Provider({ recipes, slotRecipes, children, ...props }: ProviderProps) {
  // console.log('recipes', recipes)
  // console.log('recipeslots', slotRecipes)

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
  // Chakra wraps every style in a cascade layer by default, and any un-layered rule on the host
  // page beats every layered one regardless of specificity — so a host's CSS reset (the Forms
  // app's @unocss/reset) strips the recipes' borders, font sizes/weights and button colours.
  // Un-layered, the recipes' class selectors outrank a reset's element/universal selectors. That
  // would also let Chakra's own reset and global styles override the host page, so both are
  // scoped to the wrapper below.
  const system = createSystem(
    { ...defaultConfig, globalCss: scopeGlobalCss(defaultConfig.globalCss ?? {}) },
    defineConfig({ disableLayers: true, preflight: { scope: WITHIN_SCOPE } }),
    theme,
  )

  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} defaultTheme={isDarkMode ? "dark" : "light"}>
        <div className={SCOPE_CLASS}>{children}</div>
      </ColorModeProvider>
    </ChakraProvider>
  )
}
