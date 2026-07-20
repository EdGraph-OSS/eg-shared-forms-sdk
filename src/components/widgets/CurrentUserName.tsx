import type { WidgetProps } from '@rjsf/utils'
import type { ChangeEvent } from 'react'
import {
  Field,
  Flex,
  Input,
  Text,
} from '@chakra-ui/react'

export default function CurrentUserName(props: WidgetProps) {
  const error = props.rawErrors ? props.rawErrors.join(', ') : ''

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const valChanged = e.target.value === '' ? undefined : e.target.value
    props.onChange(valChanged)
  }

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
          <Text
            color="#333"
            _dark={{ color: 'gray.200' }}
            fontWeight="600"
            mb={1}
          >
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
          fontSize="1rem"
          padding="15px"
          h="54px"
          border={error ? '2px solid red' : '2px solid #e9ecef'}
          borderRadius="6px"
          bg="white"
          _dark={{ bg: 'gray.800', color: 'gray.100', borderColor: error ? 'red.500' : 'gray.600' }}
          outline="none"
          _focus={{ border: error ? '2px solid red' : `2px solid gray` }}
          _focusVisible={{ borderColor: error ? 'red.500' : 'gray.500' }}
        />
      </Flex>
    </Field.Root>
  )
}
