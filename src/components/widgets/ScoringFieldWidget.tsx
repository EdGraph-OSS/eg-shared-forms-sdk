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
import { scoringFieldRecipe } from '../../ui/recipes/scoring-field'
import { useRecipeStyles } from '../../ui/use-recipe-styles'

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

  const recipe = useRecipeStyles('scoringField', scoringFieldRecipe)
  const trackStyles = recipe({ invalid: !!error }).track
  const headerStyles = recipe().header

  return (
    <Field.Root className='eg-scoring-field-widget' required={required} readOnly={readonly} invalid={!!error} mb={0}>
      {uiSchema?.['ui:header'] && (
        <Text css={headerStyles} mb={2}>
          {uiSchema?.['ui:header']}
        </Text>
      )}
      <Flex
        aria-describedby={ariaDescribedByIds(id)}
        role="group"
        aria-label="Rating"
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
              order={Number(score)}
              variant="solid"
              className={isSelected ? "eg-active-score-bg" : "eg-inactive-score"}
              onClick={() => handleSelect(score)}
              disabled={readonly}
              px={4}
              py={2}
              borderRightWidth={score !== '0' ? '1px' : 0}
              borderRightColor="whiteAlpha.400"
              _hover={readonly ? {} : { opacity: 0.9 }}
              css={{
                ...buttonStyles,
                _dark: { ...(buttonStyles._dark as Record<string, unknown> | undefined), borderRightColor: 'gray.600' },
              }}
            >
              {score === '0' ? 'N/A' : score}
            </Button>
          )
        })}
      </Flex>
    </Field.Root>
  )
}
