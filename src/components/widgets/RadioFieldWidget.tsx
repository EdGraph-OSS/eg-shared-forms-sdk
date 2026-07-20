import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from '@rjsf/utils'
import {
  Field,
  Flex,
  HStack,
  RadioGroup,
  Text,
} from '@chakra-ui/react'
import {
  ariaDescribedByIds,
  optionId,
} from '@rjsf/utils'

export default function RadioWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  id,
  options,
  value,
  rawErrors,
  uiSchema,
  onChange,
  required,
  readonly,
}: WidgetProps<T, S, F>) {
  const { enumOptions, enumDisabled, emptyValue } = options
  const error = rawErrors ? rawErrors.join(', ') : ''

  return (
    <Field.Root className='eg-radio-field-widget' required={required} readOnly={readonly} invalid={!!error}>

      { uiSchema?.['ui:header'] && (
        <Text
          color="#333"
          _dark={{ color: 'gray.200' }}
          fontWeight="600"
          mb="16px"
        >
          { uiSchema?.['ui:header'] }
        </Text>
      )}

      <Flex
        bg='white'
        flexDir="column"
        w="full">
        <RadioGroup.Root
          value={value ?? ''}
          name={id}
          aria-describedby={ariaDescribedByIds(id)}
        >
          <HStack gap={2}>
            {Array.isArray(enumOptions) && enumOptions.map((option, index) => {
              // eslint throwing an error due to mixing operator, please confirm if it should be 1 and 2, or 2 and 3.
              const itemDisabled = readonly || (Array.isArray(enumDisabled) && enumDisabled.includes(option.value))
              return (
                <Flex key={JSON.stringify(option)}>
                  <RadioGroup.Item
                    onClick={() => !itemDisabled && onChange(option.value)}
                    disabled={itemDisabled}
                    cursor="pointer"
                    value={option.value}
                    mr='6px'
                    padding={0}
                    id={optionId(id, index)}
                  >
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator
                      cursor="pointer"
                      color="white"
                      colorScheme="accent"
                      colorPalette="blue"
                      border="1px solid transparent"
                      borderColor="gray.300 !important"
                      ringColor="var(--eg-accent)"
                    />
                    <RadioGroup.ItemText cursor="pointer" fontSize={14} color="gray.700" _dark={{ color: 'gray.100' }}>{option.label}</RadioGroup.ItemText>
                  </RadioGroup.Item>
                </Flex>
              )
            })}
          </HStack>
        </RadioGroup.Root>
      </Flex>
    </Field.Root>
  )
}
