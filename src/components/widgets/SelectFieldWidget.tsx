import type { SelectValueChangeDetails } from '@chakra-ui/react'
import type {
  EnumOptionsType,
  WidgetProps,
} from '@rjsf/utils'
import type { OptionsOrGroups } from 'chakra-react-select'
import type { FocusEvent } from 'react'
import {
  createListCollection,
  Field,
  Portal,
  Select,
  Text,
} from '@chakra-ui/react'
import {
  ariaDescribedByIds,
  enumOptionsIndexForValue,
  enumOptionsValueForIndex,
} from '@rjsf/utils'
import {
  useMemo,
  useRef,
} from 'react'

export default function SelectFieldWidget(props: WidgetProps) {
  const { id, options, label, hideLabel, placeholder, multiple, required, disabled, readonly, value, autofocus, onChange, onBlur, onFocus, rawErrors = [], schema, uiSchema } = props
  const { enumOptions, enumDisabled, emptyValue } = options

  const error = rawErrors ? rawErrors.join(', ') : ''

  const _onMultiChange = ({ value }: SelectValueChangeDetails) => {
    return onChange(enumOptionsValueForIndex(value, enumOptions, emptyValue))
  }

  const _onSingleChange = ({ value }: SelectValueChangeDetails) => {
    const selected = enumOptionsValueForIndex(value, enumOptions, emptyValue)
    return onChange(Array.isArray(selected) && selected.length === 1 ? selected[0] : selected)
  }

  const _onBlur = ({ target }: FocusEvent<HTMLInputElement>) =>
    onBlur(id, enumOptionsValueForIndex(target && target.value, enumOptions, emptyValue))

  const _onFocus = ({ target }: FocusEvent<HTMLInputElement>) =>
    onFocus(id, enumOptionsValueForIndex(target && target.value, enumOptions, emptyValue))

  const showPlaceholderOption = !multiple && schema.default === undefined
  const { valueLabelMap, displayEnumOptions } = useMemo((): {
    valueLabelMap: Record<string | number, string>
    displayEnumOptions: OptionsOrGroups<any, any>
  } => {
    const valueLabelMap: Record<string | number, string> = {}
    let displayEnumOptions: OptionsOrGroups<any, any> = []
    if (Array.isArray(enumOptions)) {
      displayEnumOptions = enumOptions.map((option: EnumOptionsType, index: number) => {
        const { value, label } = option
        valueLabelMap[index] = label || String(value)
        return {
          label,
          value: String(index),
          disabled: Array.isArray(enumDisabled) && enumDisabled.includes(value),
        }
      })
      if (showPlaceholderOption) {
        (displayEnumOptions as any[]).unshift({
          value: '',
          label: placeholder || '',
        })
      }
    }
    return {
      valueLabelMap,
      displayEnumOptions,
    }
  }, [
    enumDisabled,
    enumOptions,
    placeholder,
    showPlaceholderOption,
  ])

  const isMultiple = typeof multiple !== 'undefined' && multiple !== false && Boolean(enumOptions)
  const selectedIndex = enumOptionsIndexForValue(value, enumOptions, isMultiple)

  const getMultiValue = () =>
    ((selectedIndex as string[]) || []).map((i: string) => {
      return {
        label: valueLabelMap[i],
        value: i.toString(),
      }
    })

  const getSingleValue = () =>
    typeof selectedIndex !== 'undefined'
      ? [
        {
          label: valueLabelMap[selectedIndex as string] || '',
          value: selectedIndex.toString(),
        },
      ]
      : []

  const formValue = (isMultiple ? getMultiValue() : getSingleValue()).map(item => item.value)

  const selectOptions = createListCollection({ items: displayEnumOptions.filter(item => item.value) })

  const containerRef = useRef(null)

  return (
    <Field.Root
      invalid={!!error}
      disabled={disabled || readonly}
      required={required}
      readOnly={readonly}
      className='eg-select-field-widget'
    >
      <Select.Root
        collection={selectOptions}
        onValueChange={isMultiple ? _onMultiChange : _onSingleChange}
        value={formValue}
        multiple={multiple}
        autoFocus={autofocus}
        closeOnSelect={!multiple}
        onFocus={_onFocus}
        onBlur={_onBlur}
        aria-describedby={ariaDescribedByIds(id)}
      >
        <Select.HiddenSelect />
        <Select.Control
          border={error ? '2px solid red' : '2px solid #e9ecef'}
          fontSize="1rem"
          px={4}
          py={1}
          minWidth="390px"
          lineHeight="15px"
          h="54px"
          borderRadius="6px"
          bg="white"
          _dark={{ bg: 'gray.800', borderColor: error ? 'red.500' : 'gray.600' }}
        >
          <Select.Trigger>
            <Select.ValueText
              color="black"
              _dark={{ color: 'gray.100' }}
              fontSize={15}
              placeholder={props.placeholder ?? ''}
            />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.ClearTrigger />
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content bg="white" _dark={{ bg: 'gray.800', color: 'gray.100', borderColor: 'gray.600' }} borderWidth="1px">
              {selectOptions.items.map(item => (
                <Select.Item item={item} key={item.value?.toString()}>
                  {item.label?.toString()}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}

            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Field.Root>
  )
}
