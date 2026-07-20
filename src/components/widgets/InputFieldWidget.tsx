import type { WidgetProps } from '@rjsf/utils'
import type { ChangeEvent } from 'react'
import {
  Field,
  Flex,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react'

const BASE_FIELD = {
  fontSize: '1rem',
  minW: '390px',
  borderRadius: '6px',
  bg: 'white',
  _dark: { bg: 'gray.800', color: 'gray.100', borderColor: 'gray.600' },
  outline: 'none',
} as const

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

  const invalidBorder = {
    border: hasError ? '2px solid red' : '2px solid #e9ecef',
    _focus: { border: hasError ? '2px solid red' : '2px solid gray' },
  }

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
          <Text
            color="#333"
            _dark={{ color: 'gray.200' }}
            fontWeight="600"
            mb={1}
          >
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
            minH="100px"
            maxH="100px"
            padding="8px"
            resize="none"
            {...BASE_FIELD}
            {...invalidBorder}
          />
        ) : (
          <Input
            id={props.name}
            name={props.name}
            type="text"
            value={valueStr}
            onChange={onInputChange}
            maxLength={maxLength}
            h="54px"
            padding="8px"
            {...BASE_FIELD}
            {...invalidBorder}
          />
        )}
        {hasLengthLimit && (
          <Flex mt={1}>
            {hasMinLength && (
              <Text
                fontSize="xs"
                color="gray.500"
                _dark={{ color: 'gray.400' }}
              >
                {`Minimum characters: ${minLength}`}
              </Text>
            )}
            {maxLength !== undefined && (
              <Text
                ml="auto"
                fontSize="xs"
                color={charCount >= maxLength ? 'red.500' : 'gray.500'}
                _dark={{ color: charCount >= maxLength ? 'red.400' : 'gray.400' }}
              >
                {`${charCount}/${maxLength}`}
              </Text>
            )}
          </Flex>
        )}

      </Flex>
    </Field.Root>
  )
}
