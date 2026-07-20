import type {
  CustomValidator,
  FormValidation,
  GenericObjectType,
  RJSFSchema,
  UiSchema,
} from '@rjsf/utils'
import {
  isConditionallyRequiredValueEmpty,
  evaluateVisibilityConditions,
} from './visibility-conditions'
import {
  fieldTitleFromSectionField,
  quotedFieldLabel,
} from './humanizeRjsfErrors'

function isPlainObject(v: unknown): v is GenericObjectType {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

interface FieldErr {
  addError?: (m: string) => void
}

/**
 * Only validates fields that are **not** JSON Schema `required` (those are already handled by AJV).
 * Adding the same rules here duplicated errors in the list and in widgets (`rawErrors.join`).
 */
export function createConditionalRequiredCustomValidate(rootSchema: RJSFSchema | undefined): CustomValidator {
  return (formData, errors, uiSchema) => {
    if (!uiSchema || formData == null || typeof formData !== 'object') {
      return errors
    }

    for (const [sectionKey, sectionVal] of Object.entries(uiSchema)) {
      if (sectionKey.startsWith('ui:') || !isPlainObject(sectionVal)) {
        continue
      }

      const sectionData = (formData as GenericObjectType)[sectionKey]
      const sectionFormObj = isPlainObject(sectionData) ? sectionData : {}
      const sectionErrors = (errors as GenericObjectType)[sectionKey]
      if (!isPlainObject(sectionErrors)) {
        continue
      }

      for (const [fieldKey, fieldUiVal] of Object.entries(sectionVal)) {
        if (fieldKey.startsWith('ui:') || !isPlainObject(fieldUiVal)) {
          continue
        }

        const fieldUi = fieldUiVal as UiSchema
        if (!fieldUi['ui:requiredWhenVisible'] || !fieldUi['ui:conditions']) {
          continue
        }

        const visible = evaluateVisibilityConditions(
          fieldUi['ui:conditions'] as Parameters<typeof evaluateVisibilityConditions>[0],
          formData,
        )
        if (!visible) {
          continue
        }

        const raw = sectionFormObj[fieldKey]
        if (!isConditionallyRequiredValueEmpty(raw)) {
          continue
        }

        const fieldErr = sectionErrors[fieldKey] as FieldErr | undefined
        const label = fieldTitleFromSectionField(rootSchema, sectionKey, fieldKey)
        fieldErr?.addError?.(`${quotedFieldLabel(label)} is required.`)
      }
    }

    return errors as FormValidation
  }
}
