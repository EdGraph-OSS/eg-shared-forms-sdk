import type { WidgetProps } from '@rjsf/utils'
import type { ChangeEvent } from 'react'
import {
  Field,
  Flex,
  NativeSelect,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { textFieldRecipe } from '../../ui/recipes/text-field'
import { fieldHeaderRecipe } from '../../ui/recipes/field-header'
import { dateDropdownRecipe } from '../../ui/recipes/date-dropdown'
import { useRecipeStyles, useSingleRecipeStyles } from '../../ui/use-recipe-styles'

type DateDropdownOptions = {
  /** Earliest year offered in the Year dropdown. */
  minYear?: number
  /** Latest year offered in the Year dropdown. */
  maxYear?: number
  /** Chakra style overrides spread last onto each select field. */
  customStyles?: Record<string, unknown>
}

type DateParts = {
  year?: number
  month?: number
  day?: number
}

const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const pad2 = (n: number) => String(n).padStart(2, '0')

/** Days in a 1-based month for a given year (day 0 of the next month = last day of this one). */
function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/** Parse a "YYYY-MM-DD" value into numeric parts; ignores anything malformed. */
function parseValue(value: unknown): DateParts {
  if (typeof value !== 'string') {
    return {}
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) {
    return {}
  }
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  }
}

/**
 * Segmented date picker rendering three dependent dropdowns (Year, Month, Day)
 * side by side. Month unlocks once a Year is chosen; Day unlocks once a Month is
 * chosen, and the Day list reflects the exact number of days in the selected
 * year/month (so Feb shows 28 or 29 correctly).
 *
 * Config is read from `ui:options` (`props.options`):
 *   'ui:widget': 'DateDropdownWidget'
 *   'ui:options':
 *     minYear: earliest selectable year (default 1900)
 *     maxYear: latest selectable year (default current year)
 *
 * Emits a complete date as an ISO "YYYY-MM-DD" string; while the selection is
 * partial it reports `undefined` so required validation still fires.
 */
export default function DateDropdownWidget(props: WidgetProps) {
  const { options = {} } = props
  const { minYear: minYearOpt, maxYear: maxYearOpt, customStyles } = options as DateDropdownOptions

  const maxYear = typeof maxYearOpt === 'number' ? maxYearOpt : new Date().getFullYear()
  const minYear = typeof minYearOpt === 'number' ? minYearOpt : 1900
  // Guard against an inverted range so the Year list is never empty.
  const [lowYear, highYear] = minYear <= maxYear ? [minYear, maxYear] : [maxYear, minYear]

  const error = props.rawErrors ? props.rawErrors.join(', ') : ''
  const hasError = !!error
  const isDisabled = props.disabled || props.readonly

  // Local state holds partial selections that can't yet be reported outward
  // (RJSF only receives a value once all three parts are set).
  const [parts, setParts] = useState<DateParts>(() => parseValue(props.value))

  // Re-sync when the value changes externally (form reset, prefilled data).
  useEffect(() => {
    const incoming = parseValue(props.value)
    const assembled = parts.year && parts.month && parts.day
      ? `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`
      : undefined
    if (props.value !== assembled) {
      setParts(incoming)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value])

  function commit(next: DateParts) {
    setParts(next)
    if (next.year && next.month && next.day) {
      props.onChange(`${next.year}-${pad2(next.month)}-${pad2(next.day)}`)
    }
    else {
      props.onChange(undefined)
    }
  }

  function onYearChange(e: ChangeEvent<HTMLSelectElement>) {
    const year = e.target.value ? Number(e.target.value) : undefined
    const next: DateParts = { ...parts, year }
    // A day that no longer exists in the new year (Feb 29 on a common year) is cleared.
    if (year && next.month && next.day && next.day > daysInMonth(year, next.month)) {
      next.day = undefined
    }
    commit(next)
  }

  function onMonthChange(e: ChangeEvent<HTMLSelectElement>) {
    const month = e.target.value ? Number(e.target.value) : undefined
    const next: DateParts = { ...parts, month }
    if (parts.year && month && next.day && next.day > daysInMonth(parts.year, month)) {
      next.day = undefined
    }
    commit(next)
  }

  function onDayChange(e: ChangeEvent<HTMLSelectElement>) {
    const day = e.target.value ? Number(e.target.value) : undefined
    commit({ ...parts, day })
  }

  const years: number[] = []
  for (let y = highYear; y >= lowYear; y--) {
    years.push(y)
  }

  const monthEnabled = !isDisabled && parts.year !== undefined
  const dayEnabled = !isDisabled && parts.year !== undefined && parts.month !== undefined

  const dayCount = parts.year && parts.month ? daysInMonth(parts.year, parts.month) : 31
  const days = Array.from({ length: dayCount }, (_, i) => i + 1)

  const fieldStyles = useSingleRecipeStyles('textField', textFieldRecipe)({ invalid: hasError })
  const fieldCss = { ...fieldStyles, ...(customStyles ?? {}) }
  const headerStyles = useSingleRecipeStyles('fieldHeader', fieldHeaderRecipe)()
  const columnLabelStyles = useRecipeStyles('dateDropdown', dateDropdownRecipe)().columnLabel

  return (
    <Field.Root
      readOnly={props.readonly}
      invalid={hasError}
      className='eg-date-dropdown-widget'
    >
      <Flex
        flexDir="column"
        w="full"
        mt={1}
      >
        {props.uiSchema?.['ui:header'] && (
          <Text css={headerStyles} mb={2}>
            {props.uiSchema?.['ui:header']}
          </Text>
        )}

        <Flex gap={4} w="full" flexWrap={{ base: 'wrap', sm: 'nowrap' }}>
          {/* Year */}
          <Flex flexDir="column" flex="1" minW="110px">
            <Text css={columnLabelStyles} mb={1}>
              Year
            </Text>
            <NativeSelect.Root size="lg" disabled={isDisabled}>
              <NativeSelect.Field
                placeholder="Year"
                value={parts.year ?? ''}
                onChange={onYearChange}
                h="54px"
                css={fieldCss}
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Flex>

          {/* Month */}
          <Flex flexDir="column" flex="1" minW="110px">
            <Text css={columnLabelStyles} mb={1}>
              Month
            </Text>
            <NativeSelect.Root size="lg" disabled={!monthEnabled}>
              <NativeSelect.Field
                placeholder="Month"
                value={parts.month ?? ''}
                onChange={onMonthChange}
                h="54px"
                css={fieldCss}
              >
                {MONTH_LABELS.map((label, i) => (
                  <option key={label} value={i + 1}>{label}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Flex>

          {/* Day */}
          <Flex flexDir="column" flex="1" minW="90px">
            <Text css={columnLabelStyles} mb={1}>
              Day
            </Text>
            <NativeSelect.Root size="lg" disabled={!dayEnabled}>
              <NativeSelect.Field
                placeholder="Day"
                value={parts.day ?? ''}
                onChange={onDayChange}
                h="54px"
                css={fieldCss}
              >
                {days.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Flex>
        </Flex>
      </Flex>
    </Field.Root>
  )
}
