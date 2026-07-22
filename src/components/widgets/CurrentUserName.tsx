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

export default function CurrentUserName(props: WidgetProps) {
  const error = props.rawErrors ? props.rawErrors.join(', ') : ''

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const valChanged = e.target.value === '' ? undefined : e.target.value
    props.onChange(valChanged)
  }

  const fieldStyles = useSingleRecipeStyles('textField', textFieldRecipe)({ invalid: !!error })
  const headerStyles = useSingleRecipeStyles('fieldHeader', fieldHeaderRecipe)()

  return (
    <Field.Root
      invalid={!!error}
    >
      <Flex
        flexDir={{
          base: 'column',
          md: 'row',
        }}
        alignItems={{
          base: 'stretch',
          md: 'center',
        }}
        justifyContent={{
          base: 'stretch',
          md: 'center',
        }}
        w="full"
        mt={1}
      >
        { props.uiSchema?.['ui:header'] && (
          <Text css={headerStyles} mb={1}>
            { props.uiSchema?.['ui:header'] }
          </Text>
        )}

        <Input
          id={props.name}
          name={props.name}
          type="textarea"
          readOnly
          disabled
          value={props.defaultValue ?? props.value}
          onChange={onChange}
          padding="15px"
          h="54px"
          css={fieldStyles}
        />
      </Flex>
    </Field.Root>
  )
}
