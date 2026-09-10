import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from '@rjsf/utils'
import {
  Button,
  Field,
  Flex,
  Text,
} from '@chakra-ui/react'
import { ariaDescribedByIds } from '@rjsf/utils'
import { useRef } from 'react'
import { LuCheck } from 'react-icons/lu'
import { scoringFieldRecipe } from '../../ui/recipes/scoring-field'
import { useRecipeStyles } from '../../ui/use-recipe-styles'

// Visually hides the group label from sighted users while still exposing it
// to assistive tech, for the (rare) case an indicator has no visible header.
const visuallyHiddenStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
} as const

// Left-to-right display order (matches the `order` style below), used for arrow-key navigation.
const VISUAL_ORDER = ['0', '1', '2', '3', '4']

export default function ScoringFieldWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  id,
  options,
  value,
  rawErrors,
  uiSchema,
  onChange,
  required,
  readonly,
}: WidgetProps<T, S, F>) {
  const error = rawErrors ? rawErrors.join(', ') : ''
  const currentValue = value != null ? String(value) : ''
  const scoreValues = [
    '4',
    '3',
    '2',
    '1',
    '0',
  ]
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  function handleSelect(score: string) {
    if (readonly) { return }
    // if already selected, clear the value
    if (currentValue === score) {
      onChange('')
      return
    }
    // Always emit as string so JSON Schema const/enum conditions match reliably.
    onChange(score)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, score: string) {
    if (readonly) { return }
    const currentIndex = VISUAL_ORDER.indexOf(score)
    let nextIndex: number
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % VISUAL_ORDER.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + VISUAL_ORDER.length) % VISUAL_ORDER.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = VISUAL_ORDER.length - 1
        break
      default:
        return
    }
    event.preventDefault()
    const nextScore = VISUAL_ORDER[nextIndex]
    onChange(nextScore)
    buttonRefs.current[nextScore]?.focus()
  }

  const recipe = useRecipeStyles('scoringField', scoringFieldRecipe)
  const trackStyles = recipe({ invalid: !!error }).track
  const headerStyles = recipe().header

  const headerId = `${id}-header`
  const hasHeader = !!uiSchema?.['ui:header']
  // The item that receives focus via Tab: the selected score, or the first option if none is selected yet.
  const activeScore = currentValue || VISUAL_ORDER[0]

  return (
    <Field.Root className='eg-scoring-field-widget' required={required} readOnly={readonly} invalid={!!error} mb={0}>
      <Text id={headerId} css={hasHeader ? headerStyles : visuallyHiddenStyle} mb={hasHeader ? 2 : 0}>
        {hasHeader ? uiSchema?.['ui:header'] : 'Rating'}
      </Text>
      <Flex
        aria-describedby={ariaDescribedByIds(id)}
        role="radiogroup"
        aria-labelledby={headerId}
        w="fit-content"
        alignSelf={"end"}
        justify="end"
        alignItems="end"
        css={trackStyles}
      >
        {scoreValues.map((score) => {
          const isSelected = currentValue === score
          const buttonStyles = recipe({ selected: isSelected }).button as Record<string, unknown>
          return (
            <Button
              key={score}
              ref={(el) => { buttonRefs.current[score] = el }}
              order={Number(score)}
              variant="solid"
              className={isSelected ? "eg-active-score-bg" : "eg-inactive-score"}
              onClick={() => handleSelect(score)}
              onKeyDown={(event) => handleKeyDown(event, score)}
              disabled={readonly}
              role="radio"
              aria-checked={isSelected}
              tabIndex={score === activeScore ? 0 : -1}
              px={4}
              py={2}
              gap={1}
              borderBottomColor={isSelected ? 'currentColor' : 'transparent'}
              _hover={readonly ? {} : { opacity: 0.9 }}
              css={{
                ...buttonStyles,
                _dark: { ...(buttonStyles._dark as Record<string, unknown> | undefined), borderRightColor: 'gray.600' },
              }}
            >
              {score === '0' ? 'N/A' : score}
              {isSelected && <LuCheck aria-hidden="true" size={14} />}
            </Button>
          )
        })}
      </Flex>
    </Field.Root>
  )
}
