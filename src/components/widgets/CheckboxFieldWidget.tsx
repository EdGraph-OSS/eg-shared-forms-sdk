import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from '@rjsf/utils'
import {
  Checkbox,
  CheckboxGroup,
  Field,
  Flex,
  Text,
  VStack,
} from '@chakra-ui/react'
import {
  ariaDescribedByIds,
  optionId,
} from '@rjsf/utils'

export default function CheckboxWidget<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any>({
  id,
  options,
  value,
  rawErrors,
  uiSchema,
  onChange,
  required,
  readonly,
}: WidgetProps<T, S, F>) {
  const { enumOptions, enumDisabled } = options
  const error = rawErrors ? rawErrors.join(', ') : ''
  // Checkbox is multi-select: formData holds an array of the selected option values.
  const selected: string[] = Array.isArray(value) ? value.map(v => String(v)) : []

  return (
    <Field.Root className='eg-checkbox-field-widget' required={required} readOnly={readonly} invalid={!!error}>

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
        bg="white"
        _dark={{ bg: 'gray.800', borderColor: error ? 'red.500' : 'gray.600' }}
        borderWidth="2px"
        borderColor={error ? 'red.500' : '#e9ecef'}
        flexDir="column"
        w="full"
        padding="8px"
      >
        <CheckboxGroup
          value={selected}
          onValueChange={(next: string[]) => !readonly && onChange(next as unknown as T)}
          disabled={readonly}
        >
          <VStack gap={1} alignItems="flex-start" aria-describedby={ariaDescribedByIds(id)}>
            {Array.isArray(enumOptions) && enumOptions.map((option, index) => {
              const itemDisabled = readonly || (Array.isArray(enumDisabled) && enumDisabled.includes(option.value))
              const itemId = optionId(id, index)
              return (
                <Checkbox.Root
                  key={JSON.stringify(option)}
                  className="hover:(bg-gray-200 cursor-pointer) rounded p-2 pb-1!"
                  disabled={itemDisabled}
                  cursor="pointer"
                  value={String(option.value)}
                  margin={0}
                  padding={0}
                  id={itemId}
                  ids={{
                    root: `${itemId}-root`,
                    hiddenInput: itemId,
                    control: `${itemId}-control`,
                    label: `${itemId}-label`,
                  }}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control
                    cursor="pointer"
                    color="white"
                    colorPalette="blue"
                    border="1px solid transparent"
                    borderColor="gray.300 !important"
                    ringColor="var(--eg-accent)"
                  />
                  <Checkbox.Label cursor="pointer" fontSize={14} color="gray.700" _dark={{ color: 'gray.100' }}>{option.label}</Checkbox.Label>
                </Checkbox.Root>
              )
            })}
          </VStack>
        </CheckboxGroup>
      </Flex>
    </Field.Root>
  )
}
