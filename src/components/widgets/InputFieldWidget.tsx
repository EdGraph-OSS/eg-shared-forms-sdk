import type { WidgetProps } from '@rjsf/utils'
import type { ChangeEvent } from 'react'
import {
  Field,
  Flex,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { textFieldRecipe } from '../../ui/recipes/text-field'
import { fieldHeaderRecipe } from '../../ui/recipes/field-header'
import { inputHintRecipe } from '../../ui/recipes/input-hint'
import { useRecipeStyles, useSingleRecipeStyles } from '../../ui/use-recipe-styles'

type TextFieldOptions = {
  multiline?: boolean
  rows?: number
}

export default function InputFieldWidget(props: WidgetProps) {
  const { options = {} } = props
  const { multiline: multilineOpt, rows: rowsOpt } = options as TextFieldOptions
  const error = props.rawErrors ? props.rawErrors.join(', ') : ''
  const hasError = !!error
  const minLength = typeof props.schema.minLength === 'number' ? props.schema.minLength : undefined
  const maxLength = typeof props.schema.maxLength === 'number' ? props.schema.maxLength : undefined
  const hasMinLength = minLength !== undefined && minLength > 0
  const hasLengthLimit = hasMinLength || maxLength !== undefined

  /** RJSF must stay controlled from `value`; `defaultValue` breaks sync and schema validation. */
  const valueStr = props.value ?? ''
  const charCount = valueStr.length

  const isMultiline =
    multilineOpt === true
    || (typeof rowsOpt === 'number' && rowsOpt > 0)

  const rows = typeof rowsOpt === 'number' && rowsOpt > 0 ? rowsOpt : 4

  function onChangeString(next: string) {
    props.onChange(next === '' ? undefined : next)
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    onChangeString(e.target.value)
  }

  function onTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    onChangeString(e.target.value)
  }

  const fieldStyles = useSingleRecipeStyles('textField', textFieldRecipe)({ invalid: hasError })
  const headerStyles = useSingleRecipeStyles('fieldHeader', fieldHeaderRecipe)()
  const hintStyles = useRecipeStyles('inputHint', inputHintRecipe)({ exceeded: maxLength !== undefined && charCount >= maxLength })

  return (
    <Field.Root
      readOnly={props.readonly}
      invalid={hasError}
      className='eg-input-field-widget'
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

        {isMultiline ? (
          <Textarea
            id={props.name}
            name={props.name}
            value={valueStr}
            onChange={onTextareaChange}
            maxLength={maxLength}
            rows={rows}
            minW="390px"
            minH="100px"
            maxH="100px"
            padding="8px"
            resize="none"
            css={fieldStyles}
          />
        ) : (
          <Input
            id={props.name}
            name={props.name}
            type="text"
            value={valueStr}
            onChange={onInputChange}
            maxLength={maxLength}
            minW="390px"
            h="54px"
            padding="8px"
            css={fieldStyles}
          />
        )}
        {hasLengthLimit && (
          <Flex mt={1}>
            {hasMinLength && (
              <Text css={hintStyles.min}>
                {`Minimum characters: ${minLength}`}
              </Text>
            )}
            {maxLength !== undefined && (
              <Text ml="auto" css={hintStyles.count}>
                {`${charCount}/${maxLength}`}
              </Text>
            )}
          </Flex>
        )}

      </Flex>
    </Field.Root>
  )
}
