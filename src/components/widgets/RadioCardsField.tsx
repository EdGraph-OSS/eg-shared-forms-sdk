import type { FieldProps } from '@rjsf/utils'
import type { ReactNode } from 'react'
import type { SystemStyleObject } from '@chakra-ui/react'
import {
  Field,
  RadioCard,
  Text,
  VStack,
} from '@chakra-ui/react'
import { IconBadge } from '../../ui/recipes/icon-badge'
import { choiceCardRecipe } from '../../ui/recipes/choice-card'
import { fieldHeaderRecipe } from '../../ui/recipes/field-header'
import { useRecipeStyles, useSingleRecipeStyles } from '../../ui/use-recipe-styles'

/** A single selectable card. Mirrors `RadioCardItem` in models/form.ts. */
type RadioCardItem = {
  /** Key written to formData (set to `true`) when this card is selected. */
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

type RadioCardsOptions = {
  /** Cards to render, in display order. */
  cards?: RadioCardItem[]
  /** Chakra style overrides applied to the field's outer container. */
  customStyles?: SystemStyleObject
}

/** The stored value: a flat map of selected card values to `true`. Unselected cards are omitted. */
type RadioCardsValue = Record<string, boolean>

/** Coerce loosely-typed options into a clean RadioCardItem[] (recursively for subItems). */
function parseCards(raw: unknown): RadioCardItem[] {
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
      const sub = parseCards(subItems)
      if (sub.length) {
        item.subItems = sub
      }
      return item
    })
    .filter((card): card is RadioCardItem => card !== null)
}

/**
 * Find the path of card values from the root down to (and including) `target`.
 * Returns [] if the value is not found anywhere in the tree.
 */
function findValuePath(cards: RadioCardItem[], target: string): string[] {
  for (const card of cards) {
    if (card.value === target) {
      return [card.value]
    }
    if (card.subItems?.length) {
      const sub = findValuePath(card.subItems, target)
      if (sub.length) {
        return [card.value, ...sub]
      }
    }
  }
  return []
}

/** The deepest selected value in the tree — the single card shown as "checked" in the radio group. */
function deepestSelected(cards: RadioCardItem[], value: RadioCardsValue): string {
  let best = ''
  let bestDepth = -1
  const walk = (items: RadioCardItem[], depth: number) => {
    for (const item of items) {
      if (value[item.value] && depth > bestDepth) {
        best = item.value
        bestDepth = depth
      }
      if (item.subItems?.length) {
        walk(item.subItems, depth + 1)
      }
    }
  }
  walk(cards, 0)
  return best
}

/**
 * Single-select cards backed by Chakra UI v3's RadioCard. Each card shows an
 * icon, a title and a description; cards with `subItems` reveal a nested,
 * indented group of smaller cards once the parent (or one of its sub-items) is
 * selected, letting the user drill down to a more specific choice.
 *
 * Registered as a custom RJSF *field* (not a widget) because the stored value is
 * an object: a flat map of the selected card values to `true`. Selecting a card
 * stores that card's `value` plus all of its ancestors, e.g. picking sub-item
 * "rent" under parent "housing" yields `{ housing: true, rent: true }`.
 * Unselected cards are omitted entirely.
 *
 * Config is read from `ui:options` on the field's uiSchema:
 *   'ui:field': 'RadioCardsField'
 *   'ui:options':
 *     cards: RadioCardItem[] — each { value, title, description?, icon?, subItems? }
 *     customStyles: Chakra SystemStyleObject applied to the field's outer container
 */
export default function RadioCardsField(props: FieldProps) {
  const uiOptions = (props.uiSchema?.['ui:options'] ?? {}) as RadioCardsOptions
  const cards = parseCards(uiOptions.cards)

  const error = props.rawErrors?.length ? props.rawErrors.join(', ') : ''
  const hasError = !!error
  const isDisabled = props.disabled || props.readonly

  const value: RadioCardsValue = (props.formData && typeof props.formData === 'object')
    ? props.formData as RadioCardsValue
    : {}

  const selected = deepestSelected(cards, value)

  /** A branch is "active" (its sub-items are shown) when the parent or any descendant is selected. */
  function isBranchActive(item: RadioCardItem): boolean {
    if (!item.subItems?.length) {
      return false
    }
    return !!value[item.value]
      || item.subItems.some(sub => !!value[sub.value] || isBranchActive(sub))
  }

  function onValueChange(details: { value: string | null }) {
    if (isDisabled) {
      return
    }
    // Pass this field's path so RJSF updates the value at `section.question` instead of
    // treating a path-less onChange as a root replacement (which wipes the rest of formData
    // and drops this field's own value, so nested sub-items never appear).
    if (details.value == null) {
      props.onChange(undefined, props.fieldPathId.path)
      return
    }
    // Store the clicked card plus all of its ancestors as `true`; drop everything else.
    const path = findValuePath(cards, details.value)
    const next: RadioCardsValue = {}
    for (const key of path) {
      next[key] = true
    }
    props.onChange(next, props.fieldPathId.path)
  }

  const choiceCardStyles = useRecipeStyles('choiceCard', choiceCardRecipe)
  const headerStyles = useSingleRecipeStyles('fieldHeader', fieldHeaderRecipe)()
  const containerStyles = { ...choiceCardStyles().container, ...(uiOptions.customStyles ?? {}) }

  function renderCard(item: RadioCardItem, sub: boolean): ReactNode {
    const cardStyles = choiceCardStyles({ sub })
    return (
      <RadioCard.Item
        key={item.value}
        value={item.value}
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        w="full"
      >
        <RadioCard.ItemHiddenInput />
        <RadioCard.ItemControl
          gap={4}
          p={sub ? 3 : 4}
          borderColor={hasError ? 'red.500' : undefined}
        >
          {item.icon && <IconBadge size={sub ? 'sm' : 'md'}>{item.icon}</IconBadge>}
          <RadioCard.ItemContent>
            <RadioCard.ItemText css={cardStyles.label}>
              {item.title}
            </RadioCard.ItemText>
            {item.description && (
              <RadioCard.ItemDescription css={cardStyles.description}>
                {item.description}
              </RadioCard.ItemDescription>
            )}
          </RadioCard.ItemContent>
          <RadioCard.ItemIndicator />
        </RadioCard.ItemControl>
      </RadioCard.Item>
    )
  }

  return (
    <Field.Root
      className="eg-radio-cards-widget"
      required={props.required}
      readOnly={props.readonly}
      invalid={hasError}
      css={containerStyles}
    >
      {props.uiSchema?.['ui:header'] && (
        <Text css={headerStyles} mb="16px">
          {props.uiSchema?.['ui:header']}
        </Text>
      )}

      <RadioCard.Root
        w="full"
        colorPalette="blue"
        value={selected || null}
        disabled={isDisabled}
        onValueChange={onValueChange}
      >
        <VStack gap={3} align="stretch" w="full">
          {cards.map(item => (
            <VStack key={item.value} gap={2} align="stretch" w="full">
              {renderCard(item, false)}

              {item.subItems?.length && isBranchActive(item) && (
                <VStack gap={2} align="stretch" pl={{ base: 4, sm: 10 }}>
                  {item.subItems.map(sub => renderCard(sub, true))}
                </VStack>
              )}
            </VStack>
          ))}
        </VStack>
      </RadioCard.Root>
    </Field.Root>
  )
}
