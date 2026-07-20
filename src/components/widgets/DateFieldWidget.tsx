import type { WidgetProps } from '@rjsf/utils'
import {
  Field,
  Flex,
  Text,
} from '@chakra-ui/react'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import { DateTime } from 'luxon'
import { useRef } from 'react'
import './DateFieldWidget.css'

export default function DateFieldWidget(props: WidgetProps) {
  const error = props.rawErrors ? props.rawErrors.join(', ') : ''
  const value = props.value ? DateTime.fromISO(props.value).toJSDate() : undefined

  function onChange(e?: Date) {
    if (e) {
      props.onChange(new Date(e).toJSON())
    }
    else {
      props.onChange(undefined)
    }
  }

  const fieldRef = useRef<HTMLDivElement | null>(null)
  return (
    <Field.Root
      className='eg-date-field-widget'
      readOnly={props.readonly}
      invalid={!!error}
    >
      <Flex
        flexDir="column"
        w="full"
        mt={2}
      >
        { props.uiSchema?.['ui:header'] && (
          <Text
            color="#333"
            _dark={{ color: 'gray.200' }}
            fontWeight="600"
            mb="8px"
          >
            { props.uiSchema?.['ui:header'] }
          </Text>
        )}

        <Flex
          ref={fieldRef}
          fontSize="1rem"
          h="54px"
          bg="white"
          _dark={{ bg: 'gray.800', borderColor: error ? 'red.500' : 'gray.600' }}
          border={error ? '2px solid red' : '2px solid #e9ecef'}
          borderRadius="6px"
          alignItems="center"
          minW="390px"
          overflow="hidden"
        >
          <div className="popover-root" style={{ width: '100%' }}>
            <SingleDatepicker
              disabled={props.readonly}

              propsConfigs={{
                popoverCompProps: {
                  popoverRootProps: {
                    children: <div className="popover-root" style={{ width: '100%' }}></div>,
                    positioning: { placement: 'top-start' },
                  },
                },

                triggerBtnProps: {
                  variant: 'plain',
                  display: 'block',
                  width: '100%',
                  height: '50px',
                  lineHeight: '50px',
                  px: '10px',
                  border: 'none',
                  borderRadius: 0,
                  bg: 'transparent',
                  color: '#333',
                  fontSize: '1rem',
                  fontWeight: 'normal',
                  textAlign: 'left',
                  cursor: 'pointer',
                  _hover: { bg: 'transparent' },
                  _dark: { color: 'gray.100' },
                },
              }}
              // triggerVariant="input"
              name={props.name}
              date={value}
              onDateChange={onChange}
            />

          </div>
        </Flex>
      </Flex>
    </Field.Root>
  )
}
