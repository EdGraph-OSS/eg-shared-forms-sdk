import type { WidgetProps } from '@rjsf/utils'
import {
  Field,
  Flex,
  Text,
} from '@chakra-ui/react'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import { DateTime } from 'luxon'
import { useRef } from 'react'
import { textFieldRecipe } from '../../ui/recipes/text-field'
import { fieldHeaderRecipe } from '../../ui/recipes/field-header'
import { useSingleRecipeStyles } from '../../ui/use-recipe-styles'
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
  const fieldStyles = useSingleRecipeStyles('textField', textFieldRecipe)({ invalid: !!error })
  const headerStyles = useSingleRecipeStyles('fieldHeader', fieldHeaderRecipe)()

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
          <Text css={headerStyles} mb="8px">
            { props.uiSchema?.['ui:header'] }
          </Text>
        )}

        <Flex
          ref={fieldRef}
          h="54px"
          alignItems="center"
          minW="390px"
          overflow="hidden"
          css={fieldStyles}
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
