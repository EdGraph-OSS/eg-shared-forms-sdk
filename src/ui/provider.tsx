import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defineConfig,
  mergeConfigs,
} from '@chakra-ui/react'
import type { ThemingConfig } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import type { ColorModeProviderProps } from './color-mode'
import { colorTokens, fonts } from './theme'
import { useFontFaceLinks } from './useFontFaceLinks'
import { sectionDomainRecipe } from './recipes/section-domain'
import { fieldErrorRecipe } from './recipes/field-error'
import { errorListRecipe } from './recipes/error-list'
import { submitButtonRecipe } from './recipes/submit-button'
import { titleHeadingRecipe } from './recipes/title-heading'
import { formDescriptionRecipe } from './recipes/form-description'
import { descriptionFieldRecipe } from './recipes/description-field'
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
  descriptionField: typeof descriptionFieldRecipe
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

/**
 * Font tokens only carry a CSS `font-family` string, which Chakra can apply but
 * can't make the browser actually render — a dynamically-picked font (e.g. from
 * Google Fonts) also needs its stylesheet loaded. An `href` alongside a font
 * token's `value` is read back out here and turned into a `<link>` tag, so pasting
 * an exported theme's `tokens` straight into `Provider` is enough on its own.
 */
function extractFontFaceHrefs(tokens?: ThemingConfig['tokens']): Record<string, string> {
  const fontTokens = tokens?.fonts as Record<string, { href?: string }> | undefined
  if (!fontTokens) return {}
  return Object.fromEntries(
    Object.entries(fontTokens).flatMap(([key, token]) => (token?.href ? [[key, token.href]] : [])),
  )
}

/**
 * The theme-customization surface of `Provider` — recipes/slotRecipes/tokens overrides,
 * with no rendering-related props mixed in. This is also exactly the shape
 * `ThemeEditorPanel`'s export produces, so a previously-exported theme object can be fed
 * straight back in as-is: as the initial state for `useThemeEditorState`, or spread
 * directly onto `<Provider {...theme} />`.
 */
export interface ThemeConfig {
  /**
   * Override or extend the package's single-part recipes (fieldError, submitButton,
   * titleHeading, formDescription, descriptionField, objectFieldCustomContainer, fieldHeader,
   * textField, selectControl, iconBadge, infoMessage, verificationCode). Unset keys fall back to
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
  /**
   * Override or extend raw Chakra tokens — color scales (e.g. `colors.blue.500`)
   * as well as the package's `fonts.heading`/`fonts.body`/`fonts.mono` — on top of
   * the package defaults and Chakra's own built-ins. Only the keys you specify are
   * replaced; anything you don't set falls through to the existing default, since
   * `createSystem`/`mergeConfigs` merge token maps key by key rather than replacing
   * them wholesale. E.g. `tokens={{ fonts: { heading: { value: "'Poppins', sans-serif" } } }}`.
   *
   * A font token may also carry an `href` (e.g. a Google Fonts stylesheet URL)
   * alongside its `value` — `Provider` loads it via a `<link>` tag automatically,
   * e.g. `tokens={{ fonts: { heading: { value: "'Inter', sans-serif", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;700" } } }}`.
   */
  tokens?: ThemingConfig['tokens']
}

export interface ProviderProps extends ColorModeProviderProps, ThemeConfig {}

export function Provider({ recipes, slotRecipes, tokens, ...props }: ProviderProps) {
  console.log('recipes', recipes)
  console.log('recipeslots', slotRecipes)

  useFontFaceLinks(extractFontFaceHrefs(tokens))

  const baseTheme = defineConfig({
    theme: {
      tokens: {
        colors: colorTokens,
        fonts: {
          heading: { value: fonts.heading },
          body: { value: fonts.body },
          mono: { value: fonts.mono },
        },
      },
      recipes: {
        fieldError: fieldErrorRecipe,
        submitButton: submitButtonRecipe,
        titleHeading: titleHeadingRecipe,
        formDescription: formDescriptionRecipe,
        descriptionField: descriptionFieldRecipe,
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

  const theme = (recipes || slotRecipes || tokens)
    ? mergeConfigs(baseTheme, defineConfig({ theme: { recipes, slotRecipes, tokens } }))
    : baseTheme

  const isDarkMode = localStorage.getItem("selectedDarkMode") === "true"
  const system = createSystem(defaultConfig, theme)

  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} defaultTheme={isDarkMode ? "dark" : "light"} />
    </ChakraProvider>
  )
}
