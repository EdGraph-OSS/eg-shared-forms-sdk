import type { FieldProps } from '@rjsf/utils'
import type { ReactNode } from 'react'
import type { SystemStyleObject } from '@chakra-ui/react'
import {
  CheckboxCard,
  Fieldset,
  VStack,
} from '@chakra-ui/react'
import { IconBadge } from '../../ui/recipes/icon-badge'
import { choiceCardRecipe } from '../../ui/recipes/choice-card'
import { fieldHeaderRecipe } from '../../ui/recipes/field-header'
import { useRecipeStyles, useSingleRecipeStyles } from '../../ui/use-recipe-styles'

/** A single selectable card. Mirrors `RadioCardItem` in models/form.ts. */
type CheckboxCardItem = {
  id: string
  title: string
  description?: string
  icon?: string
  subItems?: CheckboxCardItem[]
}

type CheckboxCardsOptions = {
  cards?: CheckboxCardItem[]
  customStyles?: SystemStyleObject
}

type CheckboxCardsValue = Record<string, boolean>

function parseCards(raw: unknown): CheckboxCardItem[] {
  if (!Array.isArray(raw)) {
    return []
  }
  return raw
    .map((card): CheckboxCardItem | null => {
      if (typeof card !== 'object' || card === null) {
        return null
      }
      const { value, title, description, icon, subItems } = card as Record<string, unknown>
      if (typeof value !== 'string' || value === '') {
        return null
      }
      const item: CheckboxCardItem = {
        id: value,
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
    .filter((card): card is CheckboxCardItem => card !== null)
}

function findCard(cards: CheckboxCardItem[], target: string): CheckboxCardItem | null {
  for (const card of cards) {
    if (card.id === target) {
      return card
    }
    if (card.subItems?.length) {
      return findCard(card.subItems, target)
    }
  }
  return null
}

function descendantValues(cards: CheckboxCardItem[] | undefined): string[] {
  if (!cards?.length) {
    return []
  }
  const out: string[] = []
  for (const card of cards) {
    out.push(card.id)
    out.push(...descendantValues(card.subItems))
  }
  return out
}

/** The top-level parent card whose branch contains `target` (including the parent itself). */
function findTopParent(cards: CheckboxCardItem[], target: string): CheckboxCardItem | null {
  for (const card of cards) {
    if (card.id === target || descendantValues(card.subItems).includes(target)) {
      return card
    }
  }
  return null
}

export default function CheckboxCardsField(props: FieldProps) {
  const uiOptions = (props.uiSchema?.['ui:options'] ?? {}) as CheckboxCardsOptions
  const cards = parseCards(uiOptions.cards)

  const error = props.rawErrors?.length ? props.rawErrors.join(', ') : ''
  const hasError = !!error
  const isDisabled = props.disabled || props.readonly

  const value: CheckboxCardsValue = (props.formData && typeof props.formData === 'object')
    ? props.formData as CheckboxCardsValue
    : {}

  function toggle(cardValue: string, checked: boolean) {
    if (isDisabled) {
      return
    }
    const next: CheckboxCardsValue = { ...value }
    if (checked) {
      const parent = findTopParent(cards, cardValue)
      if (parent) {
        const allowed = new Set([parent.id, ...descendantValues(parent.subItems)])
        for (const key of Object.keys(next)) {
          if (!allowed.has(key)) {
            delete next[key]
          }
        }
      }
      next[cardValue] = true
    }
    else {
      delete next[cardValue]
      const card = findCard(cards, cardValue)
      for (const descendant of descendantValues(card?.subItems)) {
        delete next[descendant]
      }
    }
    props.onChange(Object.keys(next).length ? next : undefined, props.fieldPathId.path)
  }

  const choiceCardStyles = useRecipeStyles('choiceCard', choiceCardRecipe)
  const headerStyles = useSingleRecipeStyles('fieldHeader', fieldHeaderRecipe)()
  const containerStyles = { ...choiceCardStyles().container, ...(uiOptions.customStyles ?? {}) }

  function renderCard(item: CheckboxCardItem, sub: boolean): ReactNode {
    const cardStyles = choiceCardStyles({ sub })

    return (
      <CheckboxCard.Root
        id={`checkbox-card-${item.id}`}
        name={`checkbox-card-${item.id}`}
        checked={!!value[item.id]}
        colorPalette="blue"
        disabled={isDisabled}
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        w="full"
        onCheckedChange={details => toggle(item.id, details.checked === true)}>
        <CheckboxCard.HiddenInput />
        <CheckboxCard.Control
          gap={4}
          p={sub ? 3 : 4}
          borderColor={hasError ? 'red.500' : undefined}>
          {item.icon && <IconBadge size={sub ? 'sm' : 'md'}>{item.icon}</IconBadge>}
          <CheckboxCard.Content>
            <CheckboxCard.Label css={cardStyles.label}>
              {item.title}
            </CheckboxCard.Label>
            {item.description && (
              <CheckboxCard.Description css={cardStyles.description}>
                {item.description}
              </CheckboxCard.Description>
            )}
          </CheckboxCard.Content>
          <CheckboxCard.Indicator />
        </CheckboxCard.Control>
      </CheckboxCard.Root>
    )
  }

  function renderCards(items: CheckboxCardItem[], depth: number): ReactNode {
    return (
      <VStack
        gap={depth === 0 ? 3 : 2}
        align="stretch"
        w="full"
        pl={depth > 0 ? { base: 4, sm: 10 } : undefined}>
        {items.map(item => (
          <VStack key={item.id} gap={2} align="stretch" w="full">
            {renderCard(item, depth > 0)}

            {item.subItems?.length && !!value[item.id] && (
              <div onClick={e => e.stopPropagation()}>
                {renderCards(item.subItems, depth + 1)}
              </div>
            )}
          </VStack>
        ))}
      </VStack>
    )
  }

  return (
    <Fieldset.Root
      className="eg-checkbox-cards-widget"
      disabled={isDisabled}
      invalid={hasError}
      css={containerStyles}>
      {props.uiSchema?.['ui:header'] && (
        <Fieldset.Legend css={headerStyles} mb="16px">
          {props.uiSchema?.['ui:header']}
        </Fieldset.Legend>
      )}

      {renderCards(cards, 0)}
    </Fieldset.Root>
  )
}