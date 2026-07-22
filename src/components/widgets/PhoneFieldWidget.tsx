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

export default function PhoneFieldWidget(props: WidgetProps) {
  const error = props.rawErrors ? props.rawErrors.join(', ') : ''
  const hasError = !!error

  /** RJSF must stay controlled from `value`; `defaultValue` breaks sync and schema validation. */
  const valueStr = props.value ?? ''

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    props.onChange(next === '' ? undefined : next)
  }

  const fieldStyles = useSingleRecipeStyles('textField', textFieldRecipe)({ invalid: hasError })
  const headerStyles = useSingleRecipeStyles('fieldHeader', fieldHeaderRecipe)()

  return (
    <Field.Root
      readOnly={props.readonly}
      invalid={hasError}
      className='eg-phone-field-widget'
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
          type="tel"
          inputMode="tel"
          value={valueStr}
          onChange={onInputChange}
          placeholder={props.placeholder}
          minW="390px"
          h="54px"
          padding="8px"
          css={fieldStyles}
        />
      </Flex>
    </Field.Root>
  )
}
