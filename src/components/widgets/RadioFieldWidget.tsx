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
import { radioFieldRecipe } from '../../ui/recipes/radio-field'
import { fieldHeaderRecipe } from '../../ui/recipes/field-header'
import { useRecipeStyles, useSingleRecipeStyles } from '../../ui/use-recipe-styles'

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

  const styles = useRecipeStyles('radioField', radioFieldRecipe)()
  const headerStyles = useSingleRecipeStyles('fieldHeader', fieldHeaderRecipe)()

  return (
    <Field.Root className='eg-radio-field-widget' required={required} readOnly={readonly} invalid={!!error}>

      { uiSchema?.['ui:header'] && (
        <Text css={headerStyles} mb="16px">
          { uiSchema?.['ui:header'] }
        </Text>
      )}

      <Flex css={styles.container}>
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
                    <RadioGroup.ItemIndicator css={styles.indicator} />
                    <RadioGroup.ItemText css={styles.text}>{option.label}</RadioGroup.ItemText>
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
