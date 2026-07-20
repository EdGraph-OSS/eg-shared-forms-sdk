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

  const activeBg = '#2C5282'
  const inactiveBg = '#E2E8F0'
  const activeColor = 'white'
  const inactiveColor = '#4A5568'

  return (
    <Field.Root className='eg-scoring-field-widget' required={required} readOnly={readonly} invalid={!!error} mb={0}>
      {uiSchema?.['ui:header'] && (
        <Text color="#4A5568" _dark={{ color: 'gray.300' }} fontWeight="600" mb={2} fontSize="sm">
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
        borderRadius="md"
        overflow="hidden"
        borderWidth={error ? '2px' : '1px'}
        borderColor={error ? 'red.500' : inactiveBg}
        _dark={{ borderColor: error ? 'red.500' : 'gray.600' }}
      >
        {scoreValues.map((score) => {
          const isSelected = currentValue === score
          return (
            <Button
              key={score}
              order={Number(score)}
              variant="solid"
              bg={isSelected ? activeBg : inactiveBg}
              color={isSelected ? activeColor : inactiveColor}
              className={isSelected? "eg-active-score-bg" : "eg-inactive-score"}
              onClick={() => handleSelect(score)}
              disabled={readonly}
              fontSize="sm"
              fontWeight="bold"
              px={4}
              py={2}
              borderRadius={0}
              borderRightWidth={score !== '0' ? '1px' : 0}
              borderRightColor="whiteAlpha.400"
              _hover={readonly ? {} : { opacity: 0.9 }}
              _dark={{ bg: isSelected ? 'blue.600' : 'gray.700', color: isSelected ? 'white' : 'gray.100', borderRightColor: 'gray.600' }}
            >
              {score === '0' ? 'N/A' : score}
            </Button>
          )
        })}
      </Flex>
    </Field.Root>
  )
}
