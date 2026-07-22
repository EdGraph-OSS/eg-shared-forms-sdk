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
import { checkboxFieldRecipe } from '../../ui/recipes/checkbox-field'
import { fieldHeaderRecipe } from '../../ui/recipes/field-header'
import { useRecipeStyles, useSingleRecipeStyles } from '../../ui/use-recipe-styles'

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

  const styles = useRecipeStyles('checkboxField', checkboxFieldRecipe)({ invalid: !!error })
  const headerStyles = useSingleRecipeStyles('fieldHeader', fieldHeaderRecipe)()

  return (
    <Field.Root className='eg-checkbox-field-widget' required={required} readOnly={readonly} invalid={!!error}>

      { uiSchema?.['ui:header'] && (
        <Text css={headerStyles} mb="16px">
          { uiSchema?.['ui:header'] }
        </Text>
      )}

      <Flex css={styles.container}>
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
                  <Checkbox.Control css={styles.control} />
                  <Checkbox.Label css={styles.label}>{option.label}</Checkbox.Label>
                </Checkbox.Root>
              )
            })}
          </VStack>
        </CheckboxGroup>
      </Flex>
    </Field.Root>
  )
}
