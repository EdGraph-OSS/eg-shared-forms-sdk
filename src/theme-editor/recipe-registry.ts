import type { ProviderRecipes, ProviderSlotRecipes, RecipesRegistry, SlotRecipesRegistry } from '../ui'
import {
  fieldErrorRecipe,
  submitButtonRecipe,
  titleHeadingRecipe,
  formDescriptionRecipe,
  descriptionFieldRecipe,
  objectFieldCustomContainerRecipe,
  fieldHeaderRecipe,
  textFieldRecipe,
  selectControlRecipe,
  iconBadgeRecipe,
  infoMessageRecipe,
  verificationCodeRecipe,
  sectionDomainRecipe,
  errorListRecipe,
  conditionalFieldRecipe,
  checkboxFieldRecipe,
  radioFieldRecipe,
  choiceCardRecipe,
  inputHintRecipe,
  dividerFieldRecipe,
  scoringFieldRecipe,
  infoCardRecipe,
  contactVerificationRecipe,
  imageFieldRecipe,
  sectionPickerRecipe,
  dateDropdownRecipe,
} from '../ui'

export const recipeDefaults: RecipesRegistry = {
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
}

export const slotRecipeDefaults: SlotRecipesRegistry = {
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
}

export type RecipeEntryRef =
  | { kind: 'recipe'; key: keyof RecipesRegistry }
  | { kind: 'slotRecipe'; key: keyof SlotRecipesRegistry }

export const recipeEntries: RecipeEntryRef[] = [
  ...(Object.keys(recipeDefaults) as (keyof RecipesRegistry)[]).map(
    (key): RecipeEntryRef => ({ kind: 'recipe', key }),
  ),
  ...(Object.keys(slotRecipeDefaults) as (keyof SlotRecipesRegistry)[]).map(
    (key): RecipeEntryRef => ({ kind: 'slotRecipe', key }),
  ),
]

export function resolveEntryValue(
  entry: RecipeEntryRef,
  recipes: ProviderRecipes,
  slotRecipes: ProviderSlotRecipes,
): unknown {
  return entry.kind === 'recipe'
    ? recipes[entry.key] ?? recipeDefaults[entry.key]
    : slotRecipes[entry.key] ?? slotRecipeDefaults[entry.key]
}

export type ComponentKind = 'widget' | 'template'

export interface ComponentGroup {
  name: string
  label: string
  kind: ComponentKind
  entries: RecipeEntryRef[]
  /** Whether this widget/template also accepts a per-instance `customStyles` override via `ui:options` (see the widget's own source for the convention). Templates never do — only widgets opt in one at a time. */
  supportsCustomStyles: boolean
}

function humanizeComponentName(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase())
}

function recipe(key: keyof RecipesRegistry): RecipeEntryRef {
  return { kind: 'recipe', key }
}

function slotRecipe(key: keyof SlotRecipesRegistry): RecipeEntryRef {
  return { kind: 'slotRecipe', key }
}

/**
 * Maps each themable widget/template (from src/components/widgets and
 * src/components/templates) to the recipes and slot recipes it actually
 * consumes, per their useRecipeStyles/useSingleRecipeStyles calls. Widgets
 * with no themable recipe (HtmlFieldWidget) are omitted since there'd be
 * nothing to show in the second picker.
 */
const componentRecipeMap: Record<ComponentKind, Record<string, RecipeEntryRef[]>> = {
  widget: {
    CheckboxCardsField: [slotRecipe('choiceCard'), recipe('fieldHeader'), recipe('iconBadge')],
    CheckboxFieldWidget: [slotRecipe('checkboxField'), recipe('fieldHeader')],
    ContactVerificationField: [slotRecipe('contactVerification'), recipe('textField'), recipe('fieldHeader')],
    CurrentUserName: [recipe('textField'), recipe('fieldHeader')],
    DateDropdownWidget: [recipe('textField'), recipe('fieldHeader'), slotRecipe('dateDropdown')],
    DateFieldWidget: [recipe('textField'), recipe('fieldHeader')],
    EmailFieldWidget: [recipe('textField'), recipe('fieldHeader')],
    ImageFieldWidget: [slotRecipe('imageField')],
    InfoCardWidget: [slotRecipe('infoCard')],
    InfoMessageWidget: [recipe('infoMessage')],
    InputFieldWidget: [recipe('textField'), recipe('fieldHeader'), slotRecipe('inputHint')],
    NumberFieldWidget: [recipe('textField'), recipe('fieldHeader')],
    OrFieldWidget: [slotRecipe('dividerField')],
    PhoneFieldWidget: [recipe('textField'), recipe('fieldHeader')],
    RadioCardsField: [slotRecipe('choiceCard'), recipe('fieldHeader'), recipe('iconBadge')],
    RadioFieldWidget: [slotRecipe('radioField'), recipe('fieldHeader')],
    ScoringFieldWidget: [slotRecipe('scoringField')],
    SectionPicker: [recipe('selectControl'), recipe('fieldHeader'), slotRecipe('sectionPicker')],
    SelectFieldWidget: [recipe('selectControl')],
    VerificationCodeWidget: [recipe('verificationCode'), recipe('fieldHeader')],
  },
  template: {
    CustomFieldTemplate: [slotRecipe('conditionalField')],
    DescriptionFieldTemplate: [recipe('descriptionField')],
    ErrorListTemplate: [slotRecipe('errorList')],
    FieldErrorTemplate: [recipe('fieldError')],
    ObjectFieldTemplate: [
      slotRecipe('sectionDomain'),
      recipe('titleHeading'),
      recipe('formDescription'),
      recipe('objectFieldCustomContainer'),
    ],
    SubmitButton: [recipe('submitButton')],
    TitleFieldTemplate: [recipe('titleHeading')],
  },
}

/**
 * Widgets that read a `customStyles` override out of `ui:options` (in addition to the global
 * recipe/slotRecipe styling above) — see each widget's own source for the convention. Being
 * retrofitted one widget at a time, so this list is expected to grow.
 */
const WIDGETS_WITH_CUSTOM_STYLES: Set<string> = new Set([
  'CheckboxCardsField',
  'ContactVerificationField',
  'DateDropdownWidget',
  'InfoCardWidget',
  'InfoMessageWidget',
  'RadioCardsField',
])

export const componentGroups: ComponentGroup[] = (['widget', 'template'] as ComponentKind[]).flatMap(kind =>
  Object.entries(componentRecipeMap[kind]).map(([name, entries]): ComponentGroup => ({
    name,
    label: humanizeComponentName(name),
    kind,
    entries,
    supportsCustomStyles: WIDGETS_WITH_CUSTOM_STYLES.has(name),
  })),
)

/** Widgets that support a per-instance `customStyles` override — the only ones `ComponentStylesPanel` lets you pick. */
export const widgetComponentGroups: ComponentGroup[] = componentGroups.filter(
  group => group.kind === 'widget' && group.supportsCustomStyles,
)

/**
 * Starting-point example for each widget's `customStyles`, mirroring the `component.styles`
 * convention used in sample-form.ts. These are illustrative, not an enforced allow-list — any
 * Chakra `SystemStyleObject` key still works since each widget just spreads `customStyles` onto
 * its own container/field css. `ComponentStylesPanel` seeds the JSON editor with these the first
 * time a widget is selected, so users see which properties that widget typically styles.
 */
export const customStylesSeeds: Partial<Record<string, Record<string, unknown>>> = {
  CheckboxCardsField: {
    borderRadius: '12px',
    padding: '4px',
  },
  ContactVerificationField: {
    bg: '#fdeef0',
    border: '1px solid #e8a3ad',
    borderRadius: '12px',
    padding: '20px 24px',
    tryAgainButton: {
      color: '#e8a3ad',
      borderColor: '#e8a3ad',
    },
  },
  DateDropdownWidget: {
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
  },
  InfoCardWidget: {
    bg: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
  },
  InfoMessageWidget: {
    bg: '#fff3cd',
    borderLeft: '4px solid #ffc107',
    borderRadius: '4px',
    padding: '20px',
  },
  RadioCardsField: {
    borderRadius: '12px',
    padding: '4px',
  },
}

/**
 * Starting-point example for each widget's non-style `component` properties — the `ui:options`/
 * `options` fields a widget reads besides `customStyles` (title, icon, cards, copy, …), mirroring
 * sample-form.ts's `component` object minus its `styles` key. Illustrative only, same as
 * `customStylesSeeds`: `ComponentStylesPanel`'s "Other options" editor seeds from these.
 */
export const componentOptionsSeeds: Partial<Record<string, Record<string, unknown>>> = {
  CheckboxCardsField: {
    cards: [
      { value: 'email', title: 'Email', description: 'Get updates by email', icon: '✉️' },
      { value: 'sms', title: 'SMS', description: 'Get updates by text', icon: '📱' },
    ],
  },
  ContactVerificationField: {
    title: 'Verify your contact info',
    icon: '🔒',
    maskedEmailLabel: 'Confirm the email we have on file:',
    maskedPhoneLabel: 'Confirm the phone we have on file:',
    tryButton: {
      show: true,
      text: 'Try Again',
    },
  },
  DateDropdownWidget: {
    minYear: 2000,
    maxYear: 2030,
  },
  InfoCardWidget: {
    title: 'Student Information',
    icon: '📋',
    content: [
      { type: 'rows', rows: [{ label: 'Name:', value: 'Jordan Lee' }, { label: 'Grade:', value: '5th' }] },
    ],
  },
  InfoMessageWidget: {
    preText: '🔒 Your privacy matters:',
    text: 'This information is used only for verification.',
  },
  RadioCardsField: {
    cards: [
      { value: 'email', title: 'Email', description: 'Get updates by email', icon: '✉️' },
      { value: 'sms', title: 'SMS', description: 'Get updates by text', icon: '📱' },
    ],
  },
}

export function entryId(entry: RecipeEntryRef): string {
  return `${entry.kind}:${entry.key}`
}

/**
 * Entry ids (recipe/slotRecipe) referenced by more than one component group,
 * i.e. editing them affects other widgets/templates beyond the one selected.
 */
const globalEntryIds: Set<string> = (() => {
  const usageCounts = new Map<string, number>()
  for (const group of componentGroups) {
    for (const entry of group.entries) {
      const id = entryId(entry)
      usageCounts.set(id, (usageCounts.get(id) ?? 0) + 1)
    }
  }
  return new Set(
    Array.from(usageCounts.entries())
      .filter(([, count]) => count > 1)
      .map(([id]) => id),
  )
})()

export function isGlobalEntry(entry: RecipeEntryRef): boolean {
  return globalEntryIds.has(entryId(entry))
}
