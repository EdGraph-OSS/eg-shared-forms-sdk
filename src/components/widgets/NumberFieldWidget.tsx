import type { WidgetProps } from '@rjsf/utils'
import type { ChangeEvent } from 'react'
import {
  Field,
  Flex,
  Input,
  Text,
} from '@chakra-ui/react'
import { textFieldRecipe } from '../../ui/recipes/text-field'
import { fieldHeaderRecipe } from '../../ui/recipes/field-header'
import { useSingleRecipeStyles } from '../../ui/use-recipe-styles'

export default function NumberFieldWidget(props: WidgetProps) {
  const error = props.rawErrors ? props.rawErrors.join(', ') : ''
  const hasError = !!error
  const min = typeof props.schema.minimum === 'number' ? props.schema.minimum : undefined
  const max = typeof props.schema.maximum === 'number' ? props.schema.maximum : undefined
  // `integer` schemas step by 1; `number` allows decimals.
  const step = props.schema.type === 'integer' ? 1 : (typeof props.schema.multipleOf === 'number' ? props.schema.multipleOf : 'any')

  /** RJSF must stay controlled from `value`; `defaultValue` breaks sync and schema validation. */
  const valueStr = props.value === undefined || props.value === null ? '' : String(props.value)

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    if (raw === '') {
      props.onChange(undefined)
      return
    }
    const parsed = Number(raw)
    // Keep raw string when it isn't yet a valid number (e.g. "-", "1.") so the user can keep typing.
    props.onChange(Number.isNaN(parsed) ? raw : parsed)
  }

  const fieldStyles = useSingleRecipeStyles('textField', textFieldRecipe)({ invalid: hasError })
  const headerStyles = useSingleRecipeStyles('fieldHeader', fieldHeaderRecipe)()

  return (
    <Field.Root
      readOnly={props.readonly}
      invalid={hasError}
      className='eg-number-field-widget'
    >
      <Flex
        flexDir="column"
        w="full"
        mt={1}
      >
        {props.uiSchema?.['ui:header'] && (
          <Text css={headerStyles} mb={1}>
            {props.uiSchema?.['ui:header']}
          </Text>
        )}

        <Input
          id={props.name}
          name={props.name}
          type="number"
          inputMode={props.schema.type === 'integer' ? 'numeric' : 'decimal'}
          value={valueStr}
          onChange={onInputChange}
          placeholder={props.placeholder}
          min={min}
          max={max}
          step={step}
          minW="390px"
          h="54px"
          padding="8px"
          css={fieldStyles}
        />
      </Flex>
    </Field.Root>
  )
}
