import type { SelectValueChangeDetails } from '@chakra-ui/react'
import type {
  FieldPathList,
  FieldProps,
} from '@rjsf/utils'
import type { IFormComponentOpts } from '../../models/form'
import {
  createListCollection,
  Field,
  Flex,
  Portal,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { selectControlRecipe } from '../../ui/recipes/select-control'
import { fieldHeaderRecipe } from '../../ui/recipes/field-header'
import { sectionPickerRecipe } from '../../ui/recipes/section-picker'
import { useRecipeStyles, useSingleRecipeStyles } from '../../ui/use-recipe-styles'

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/** Replace the value at `path` in a shallow-cloned tree (avoids legacy deepMerge keeping stale nested keys on clear). */
function assignAtFieldPath(
  root: Record<string, unknown> | undefined,
  path: FieldPathList,
  leaf: unknown,
): Record<string, unknown> {
  const base = root && isObject(root) ? { ...root } : {}
  if (path.length === 0) {
    return isObject(leaf) ? { ...(leaf as Record<string, unknown>) } : base
  }
  const [head, ...rest] = path
  const headKey = String(head)
  if (rest.length === 0) {
    return { ...base, [headKey]: leaf }
  }
  const prev = base[headKey]
  const prevObj = isObject(prev) ? (prev as Record<string, unknown>) : {}
  return { ...base, [headKey]: assignAtFieldPath(prevObj, rest, leaf) }
}

function errorNodeHasMessages(node: unknown): boolean {
  if (!node || typeof node !== 'object') {
    return false
  }
  const errs = (node as { __errors?: unknown }).__errors
  return Array.isArray(errs) && errs.length > 0
}

function subtreeHasKeyErrors(
  es: Record<string, unknown> | undefined,
  keys: readonly string[],
): boolean {
  if (!es || typeof es !== 'object') {
    return false
  }
  return keys.some(k => errorNodeHasMessages((es as Record<string, unknown>)[k]))
}

function stripHtmlTitle(html: string): string {
  return String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

const SCHOOL_KEYS = ['schoolId', 'schoolName'] as const
const TEACHER_KEYS = ['teacherName', 'staffUniqueId'] as const
const SECTION_KEYS = ['sectionName', 'sectionId', 'courseId'] as const

function nonEmptyStr(v: unknown): boolean {
  return typeof v === 'string' && v.trim().length > 0
}

function pickerValueHasSchool(v: Partial<IFormComponentOpts> | undefined): boolean {
  if (!v) {
    return false
  }
  if (nonEmptyStr(v.schoolName)) {
    return true
  }
  if (v.schoolId != null && v.schoolId !== '') {
    return true
  }
  return typeof v.schoolId === 'number' && v.schoolId !== 0
}

function pickerValueHasTeacher(v: Partial<IFormComponentOpts> | undefined): boolean {
  if (!v) {
    return false
  }
  return nonEmptyStr(v.teacherName) || nonEmptyStr(v.staffUniqueId)
}

function pickerValueHasSection(v: Partial<IFormComponentOpts> | undefined): boolean {
  if (!v) {
    return false
  }
  return nonEmptyStr(v.sectionName) || nonEmptyStr(v.sectionId) || nonEmptyStr(v.courseId)
}

export default function SectionPicker(props: FieldProps) {
  const rawErrorText = props.rawErrors?.length ? props.rawErrors.join(', ') : ''
  const nestedSchema = props.errorSchema as Record<string, unknown> | undefined
  const schoolFieldError = subtreeHasKeyErrors(nestedSchema, SCHOOL_KEYS)
  const teacherFieldError = subtreeHasKeyErrors(nestedSchema, TEACHER_KEYS)
  const sectionFieldError = subtreeHasKeyErrors(nestedSchema, SECTION_KEYS)
  const nestedSchemaHasErrors = schoolFieldError || teacherFieldError || sectionFieldError
  const fieldTitle = stripHtmlTitle(String(props.schema.title || 'This field'))
  const consolidatedMessage = nestedSchemaHasErrors
    ? `${fieldTitle} requires a school, teacher, and section.`
    : ''
  const displayError = consolidatedMessage || rawErrorText
  const hasAnyError = !!(displayError && displayError.length)
  const highlightAllSteps = hasAnyError && !nestedSchemaHasErrors
  const saved = props.value as Partial<IFormComponentOpts> | undefined
  const schoolInvalid = schoolFieldError || (highlightAllSteps && !pickerValueHasSchool(saved))
  const teacherInvalid = teacherFieldError || (highlightAllSteps && !pickerValueHasTeacher(saved))
  const sectionInvalid = sectionFieldError || (highlightAllSteps && !pickerValueHasSection(saved))
  const readonly = props.readonly || false
  const uiOptions = props.uiSchema?.['ui:options'] as {
    schools?: IFormComponentOpts['schools']
  } | undefined

  // Get field path from idSchema which contains the full path from root
  // idSchema.$id format: "root_custom-comps_section" or similar
  // We need to extract the path segments
  const getFieldPath = (): FieldPathList => {
    const formData = props.formData || {}
    const fieldName = props.name || 'section'

    // First, try to get from idSchema which has the full path
    if (props.fieldPathId && props.fieldPathId.path.length > 0) {
      return props.fieldPathId.path
    }

    // Fallback: try to get from name if it contains dots
    if (props.name && props.name.includes('.')) {
      return props.name.split('.').filter(Boolean)
    }

    // If name is just the field name, look in formData to find where it should be nested
    // Look for the field nested inside other objects (correct location)
    for (const [key, val] of Object.entries(formData)) {
      if (isObject(val)) {
        const nestedVal = val as any
        // Check if this object contains our field (either with data or as empty object)
        if (nestedVal[fieldName] !== undefined) {
          // Found the field nested under this key - this is the correct path
          return [key, fieldName]
        }
      }
    }

    // If field exists at root level, check if there's a parent structure that should contain it
    // Look for objects that might be the parent (e.g., "custom-comps")
    if (formData[fieldName] !== undefined && typeof formData[fieldName] === 'object') {
      // Field is at root, try to find parent by looking for common parent keys
      // Check if there's a structure like "custom-comps" that should contain this field
      for (const [key, val] of Object.entries(formData)) {
        if (isObject(val) && Object.keys(val as object).length === 0) {
          // Empty object might be a placeholder for our field
          // Check if this key + fieldName makes sense (e.g., "custom-comps" + "section")
          return [key, fieldName]
        }
      }
    }

    // Default: return just the field name (will set at root - not ideal but fallback)
    return [fieldName]
  }

  const fieldPath = getFieldPath()

  // Custom onChange that nests the value under the field path
  const handleChange = (value: any) => {
    if (fieldPath.length === 0) {
      // If no path, just call onChange directly
      // @ts-expect-error - FieldProps onChange signature differs but works correctly
      props.onChange(value)
      return
    }

    const currentFormData = props.formData
    const updatedFormData = assignAtFieldPath(
      currentFormData && isObject(currentFormData)
        ? (currentFormData as Record<string, unknown>)
        : undefined,
      fieldPath,
      value,
    )

    // Call onChange with the updated formData
    // @ts-expect-error - FieldProps onChange signature differs but we're manually handling nesting
    props.onChange(updatedFormData)
  }

  const currentValue: IFormComponentOpts = props.value || {
    schoolId: 0,
    schoolName: '',
    teacherName: '',
    staffUniqueId: '',
    sectionName: '',
    sectionId: '',
    courseId: '',
  }

  const schoolOptions = uiOptions?.schools || []

  const preselectedSchoolIdx = schoolOptions.findIndex(s => s.schoolId === currentValue.schoolId && s.schoolName === currentValue.schoolName)
  const preselectedSchool = preselectedSchoolIdx >= 0 ? `${preselectedSchoolIdx + 1}` : ''

  const selectedSchool = preselectedSchoolIdx >= 0 ? schoolOptions[preselectedSchoolIdx] : null
  const teacherOptions = selectedSchool?.teachers || []

  const preselectedTeacherIdx = teacherOptions.findIndex(t => t.teacherName === currentValue.teacherName && t.staffUniqueId === currentValue.staffUniqueId)
  const preselectedTeacher = preselectedTeacherIdx >= 0 ? `${preselectedTeacherIdx + 1}` : ''

  const selectedTeacher = preselectedTeacherIdx >= 0 ? teacherOptions[preselectedTeacherIdx] : null
  const sectionOptions = selectedTeacher?.sections || []

  const preselectedSectionIdx = sectionOptions.findIndex(s => s.sectionId === currentValue.sectionId && s.sectionName === currentValue.sectionName)
  const preselectedSection = preselectedSectionIdx >= 0 ? `${preselectedSectionIdx + 1}` : ''

  const [selectedSchoolIndex, setSelectedSchoolIndex] = useState<string[]>([preselectedSchool])
  const [selectedTeacherIndex, setSelectedTeacherIndex] = useState<string[]>([preselectedTeacher])
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<string[]>([preselectedSection])

  function onSchoolChange(e: SelectValueChangeDetails) {
    const selectedIdx = e.value ? e.value[0] : ''
    setSelectedSchoolIndex([selectedIdx])
    setSelectedTeacherIndex([''])
    setSelectedSectionIndex([''])

    if (!selectedIdx) {
      handleChange({})
      return
    }
    const sch = schoolOptions[Number.parseInt(selectedIdx, 10) - 1]
    if (!sch) {
      handleChange({})
      return
    }
    handleChange({
      schoolId: sch.schoolId,
      schoolName: sch.schoolName,
    })
  }

  function onTeacherChange(e: SelectValueChangeDetails) {
    const selectedIdx = e.value ? e.value[0] : ''
    setSelectedTeacherIndex([selectedIdx])
    setSelectedSectionIndex([''])

    const schoolIdx = selectedSchoolIndex[0]
    if (!schoolIdx) {
      handleChange({})
      return
    }
    const sch = schoolOptions[Number.parseInt(schoolIdx, 10) - 1]
    if (!sch) {
      handleChange({})
      return
    }

    if (!selectedIdx) {
      handleChange({
        schoolId: sch.schoolId,
        schoolName: sch.schoolName,
      })
      return
    }

    const teach = sch.teachers?.[Number.parseInt(selectedIdx, 10) - 1]
    if (!teach) {
      handleChange({
        schoolId: sch.schoolId,
        schoolName: sch.schoolName,
      })
      return
    }

    handleChange({
      schoolId: sch.schoolId,
      schoolName: sch.schoolName,
      teacherName: teach.teacherName,
      staffUniqueId: teach.staffUniqueId,
    })
  }

  function onSectionChange(e: SelectValueChangeDetails) {
    const selectedIdx = e.value ? e.value[0] : ''
    setSelectedSectionIndex([selectedIdx])

    const sIdx = selectedSchoolIndex[0]
    const tIdx = selectedTeacherIndex[0]
    if (!sIdx) {
      handleChange({})
      return
    }
    const sch = schoolOptions[Number.parseInt(sIdx, 10) - 1]
    if (!sch) {
      handleChange({})
      return
    }
    if (!tIdx) {
      handleChange({
        schoolId: sch.schoolId,
        schoolName: sch.schoolName,
      })
      return
    }
    const teach = sch.teachers?.[Number.parseInt(tIdx, 10) - 1]
    if (!teach) {
      handleChange({
        schoolId: sch.schoolId,
        schoolName: sch.schoolName,
      })
      return
    }

    if (!selectedIdx) {
      handleChange({
        schoolId: sch.schoolId,
        schoolName: sch.schoolName,
        teacherName: teach.teacherName,
        staffUniqueId: teach.staffUniqueId,
      })
      return
    }

    const selectedSection = teach.sections?.[Number.parseInt(selectedIdx, 10) - 1]
    if (!selectedSection) {
      handleChange({
        schoolId: sch.schoolId,
        schoolName: sch.schoolName,
        teacherName: teach.teacherName,
        staffUniqueId: teach.staffUniqueId,
      })
      return
    }

    handleChange({
      schoolId: sch.schoolId,
      schoolName: sch.schoolName,
      teacherName: teach.teacherName,
      staffUniqueId: teach.staffUniqueId,
      sectionName: selectedSection.sectionName,
      sectionId: selectedSection.sectionId,
      courseId: selectedSection.courseId,
    })
  }

  // Get currently selected school and teacher to compute options
  const currentSelectedSchool = selectedSchoolIndex[0]
    ? schoolOptions[Number.parseInt(selectedSchoolIndex[0]) - 1]
    : null
  const currentTeacherOptions = currentSelectedSchool?.teachers || []

  const currentSelectedTeacher = selectedTeacherIndex[0] && currentSelectedSchool
    ? currentSelectedSchool.teachers?.[Number.parseInt(selectedTeacherIndex[0]) - 1]
    : null
  const currentSectionOptions = currentSelectedTeacher?.sections || []

  const schoolCollection = createListCollection({
    // we can use uniqBy if we have to deal with duplicate school names
    items: schoolOptions.map((opt, indx) => ({
      label: `${opt.schoolName} (${opt.schoolId})`,
      value: indx + 1,
    })),
    itemToString: item => item?.label?.toString() || '',
    itemToValue: item => item?.value?.toString() || '',
  })

  const teacherCollection = createListCollection({
    items: currentTeacherOptions.map((opt, indx) => ({
      label: `${opt.teacherName} (${opt.teacherEmail})`,
      value: indx + 1,
    })),
    itemToString: item => item?.label?.toString() || '',
    itemToValue: item => item?.value?.toString() || '',
  })

  const sectionCollection = createListCollection({
    items: currentSectionOptions.map((opt, indx) => ({
      label: `${opt.sectionName} (${opt.sectionId})`,
      value: indx + 1,
    })),
    itemToString: item => item?.label?.toString() || '',
    itemToValue: item => item?.value?.toString() || '',
  })

  const schoolControlStyles = useSingleRecipeStyles('selectControl', selectControlRecipe)({ invalid: schoolInvalid, readonly })
  const teacherControlStyles = useSingleRecipeStyles('selectControl', selectControlRecipe)({ invalid: teacherInvalid, readonly })
  const sectionControlStyles = useSingleRecipeStyles('selectControl', selectControlRecipe)({ invalid: sectionInvalid, readonly })
  const headerStyles = useSingleRecipeStyles('fieldHeader', fieldHeaderRecipe)()
  const pickerStyles = useRecipeStyles('sectionPicker', sectionPickerRecipe)()

  return (
    <Field.Root
      invalid={hasAnyError}
    >
      <Flex
        w="full"
        flexDir={{
          base: 'column',
          md: 'row',
        }}
        justifyContent={{
          base: 'stretch',
          md: 'space-between',
        }}
        alignItems={{
          base: 'stretch',
          md: 'center',
        }}
      >
        <Stack flex={1} alignItems="start">
          <Text
            css={headerStyles}
            mt={props.schema.title && 4}
            display="flex"
            alignItems="center"
            gap={1}
            className={`${props.required ? 'required-star' : ''} font-bold`}
            dangerouslySetInnerHTML={{ __html: String(props.schema.title) }}
          />
          <Text
            className="text-gray-500 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: String(props.schema.description) }}
          />
        </Stack>
        <Flex flex={1} flexDir="column" w="full" mt={1}>
          {props.uiSchema?.['ui:header'] && (
            <Text css={headerStyles} mb={1}>
              {props.uiSchema?.['ui:header']}
            </Text>
          )}

          {/* School Dropdown */}
          <Flex flexDir="column" mb={3}>
            <Text
              css={pickerStyles.groupLabel}
              display="flex"
              alignItems="center"
              mb={1}
              dangerouslySetInnerHTML={{ __html: String(props.schema.title) }}
            />
            <Select.Root
              minW={{
                base: 'full',
                md: '260px',
              }}
              collection={schoolCollection}
              onValueChange={onSchoolChange}
              value={selectedSchoolIndex}
              deselectable
              disabled={readonly}
            >
              <Select.HiddenSelect />
              <Select.Control
                px={4}
                py={1}
                lineHeight="15px"
                h="54px"
                css={schoolControlStyles}
              >
                <Select.Trigger>
                  <Select.ValueText placeholder="Select school" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content bg="white" _dark={{ bg: 'gray.800', color: 'gray.100', borderColor: 'gray.600' }} borderWidth="1px">
                    {schoolCollection.size <= 0 && (
                      <Select.Item item={{}} key="no-schools">
                        <Select.ItemText>No schools found</Select.ItemText>
                      </Select.Item>
                    )}
                    {schoolCollection.items.map(item => (
                      <Select.Item
                        item={item}
                        key={item.value}
                      >
                        {item.label?.toString()}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Flex>

          {/* Teacher Dropdown */}
          <Flex flexDir="column" mb={3}>
            <Text css={pickerStyles.groupLabel} mb={1}>
              Teacher
            </Text>
            <Select.Root
              collection={teacherCollection}
              minW={{
                base: 'full',
                md: '260px',
              }}
              onValueChange={onTeacherChange}
              value={selectedTeacherIndex}
              disabled={readonly || !selectedSchoolIndex[0]}
            >
              <Select.HiddenSelect />
              <Select.Control
                px={4}
                py={1}
                lineHeight="15px"
                h="54px"
                css={teacherControlStyles}
              >
                <Select.Trigger>
                  <Select.ValueText placeholder="Select teacher" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content bg="white" _dark={{ bg: 'gray.800', color: 'gray.100', borderColor: 'gray.600' }} borderWidth="1px">
                    {teacherCollection.size <= 0 && (
                      <Select.Item item={{}} key="no-teachers">
                        <Select.ItemText>No teachers found</Select.ItemText>
                      </Select.Item>
                    )}
                    {teacherCollection.items.map((item, indx) => (
                      <Select.Item
                        item={item}
                        key={indx + 1}
                      >
                        {item.label?.toString()}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Flex>

          {/* Section Dropdown */}
          <Flex flexDir="column">
            <Text css={pickerStyles.groupLabel} mb={1}>
              Section
            </Text>
            <Select.Root
              collection={sectionCollection}
              onValueChange={onSectionChange}
              minW={{
                base: 'full',
                md: '260px',
              }}
              value={selectedSectionIndex}
              disabled={readonly || !selectedTeacherIndex[0]}
            >
              <Select.HiddenSelect />
              <Select.Control
                px={4}
                py={1}
                lineHeight="15px"
                h="54px"
                css={sectionControlStyles}
              >
                <Select.Trigger>
                  <Select.ValueText placeholder="Select section" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content bg="white" _dark={{ bg: 'gray.800', color: 'gray.100', borderColor: 'gray.600' }} borderWidth="1px">
                    {sectionCollection.size <= 0 && (
                      <Select.Item item={{}} key="no-sections">
                        <Select.ItemText>No sections found</Select.ItemText>
                      </Select.Item>
                    )}
                    {sectionCollection.items.map((item, indx) => (
                      <Select.Item item={item} key={indx + 1}>
                        {item.label?.toString()}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Flex>
          {hasAnyError && (
            <Text mt={2} css={pickerStyles.error}>
              {displayError}
            </Text>
          )}
        </Flex>
      </Flex>
    </Field.Root>
  )
}
