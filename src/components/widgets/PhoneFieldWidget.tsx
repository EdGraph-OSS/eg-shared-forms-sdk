import type { WidgetProps } from '@rjsf/utils'
import type { ChangeEvent } from 'react'
import {
  Field,
  Flex,
  Input,
  Text,
} from '@chakra-ui/react'

const BASE_FIELD = {
  fontSize: '1rem',
  minW: '390px',
  borderRadius: '6px',
  bg: 'white',
  _dark: { bg: 'gray.800', color: 'gray.100', borderColor: 'gray.600' },
  outline: 'none',
} as const

export default function PhoneFieldWidget(props: WidgetProps) {
  const error = props.rawErrors ? props.rawErrors.join(', ') : ''
  const hasError = !!error

  /** RJSF must stay controlled from `value`; `defaultValue` breaks sync and schema validation. */
  const valueStr = props.value ?? ''

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    props.onChange(next === '' ? undefined : next)
  }

  const invalidBorder = {
    border: hasError ? '2px solid red' : '2px solid #e9ecef',
    _focus: { border: hasError ? '2px solid red' : '2px solid gray' },
  }

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
          <Text
            color="#333"
            _dark={{ color: 'gray.200' }}
            fontWeight="600"
            mb={1}
          >
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
          h="54px"
          padding="8px"
          {...BASE_FIELD}
          {...invalidBorder}
        />
      </Flex>
    </Field.Root>
  )
}
