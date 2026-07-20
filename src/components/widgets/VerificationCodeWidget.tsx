import type { WidgetProps } from '@rjsf/utils'
import {
  Field,
  Flex,
  PinInput,
  Text,
} from '@chakra-ui/react'

type VerificationCodeOptions = {
  /** Number of digits in the code (defaults to 6). */
  length?: number
}

/**
 * Collects a fixed-length numeric verification code and reports the joined
 * string through RJSF's `onChange`.
 *
 * Config is read from `ui:options` (`props.options`):
 *   'ui:widget': 'VerificationCodeWidget'
 *   'ui:options':
 *     length: number of digit inputs (default 6)
 *
 * Purely presentational — holds no side effects. Sending/resending codes is the
 * caller's concern; this widget only captures the entered value.
 */
export default function VerificationCodeWidget(props: WidgetProps) {
  const { options = {} } = props
  const { length: lengthOpt } = options as VerificationCodeOptions
  const length = typeof lengthOpt === 'number' && lengthOpt > 0 ? lengthOpt : 6

  const error = props.rawErrors ? props.rawErrors.join(', ') : ''
  const hasError = !!error

  /** RJSF must stay controlled from `value`; `defaultValue` breaks sync and schema validation. */
  const valueStr = props.value ?? ''
  const code = Array.from({ length }, (_, i) => valueStr[i] ?? '')

  function onValueChange(details: { value: string[] }) {
    const next = details.value.join('')
    props.onChange(next === '' ? undefined : next)
  }

  return (
    <Field.Root
      readOnly={props.readonly}
      invalid={hasError}
      className='eg-verification-code-widget'
    >
      <Flex
        flexDir="column"
        gap="4"
        w="full"
        mt={1}
      >
        {props.uiSchema?.['ui:header'] && (
          <Text
            color="#333"
            _dark={{ color: 'gray.200' }}
            fontSize="16px"
            fontWeight="600"
          >
            {props.uiSchema?.['ui:header']}
          </Text>
        )}

        <Flex mx="auto">
          <PinInput.Root
            value={code}
            type="numeric"
            disabled={props.disabled || props.readonly}
            size={{ base: 'xl', lg: '2xl' }}
            onValueChange={onValueChange}
          >
            <PinInput.HiddenInput />
            <PinInput.Control>
              {code.map((_, index) => (
                <PinInput.Input
                  index={index}
                  key={index}
                  borderColor={hasError ? 'red.500' : undefined}
                  _focus={{
                    border: hasError ? '2px solid red' : '2px solid gray',
                  }}
                />
              ))}
            </PinInput.Control>
          </PinInput.Root>
        </Flex>
      </Flex>
    </Field.Root>
  )
}
