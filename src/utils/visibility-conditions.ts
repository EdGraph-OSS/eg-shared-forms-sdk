/** Shared visibility rule evaluation for FieldTemplate and custom validation. */

export interface ConditionRule {
  field: string
  operator: 'equals' | 'notEquals'
  value: string
}

export interface ConditionsMeta {
  logic?: 'AND' | 'OR'
  rules?: ConditionRule[]
}

export function getFormValueAtPath(root: unknown, path: string): unknown {
  if (root == null || !path) {
    return undefined
  }
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc != null && typeof acc === 'object' && key in (acc as object)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, root)
}

export function evaluateVisibilityConditions(
  conditions: ConditionsMeta | undefined,
  rootFormData: unknown,
): boolean {
  const logic = conditions?.logic ?? 'AND'
  const rules = conditions?.rules ?? []
  if (!rules.length) {
    return true
  }

  const results = rules.map((rule) => {
    const currentValue = getFormValueAtPath(rootFormData, rule.field)
    // Checkbox sources hold an array of selected values: equals means "is one of the selected".
    if (Array.isArray(currentValue)) {
      const has = currentValue.map(v => String(v ?? '')).includes(String(rule.value ?? ''))
      if (rule.operator === 'equals') {
        return has
      }
      if (rule.operator === 'notEquals') {
        return !has
      }
      return true
    }
    if (rule.operator === 'equals') {
      return String(currentValue ?? '') === String(rule.value ?? '')
    }
    if (rule.operator === 'notEquals') {
      return String(currentValue ?? '') !== String(rule.value ?? '')
    }
    return true
  })

  return logic === 'AND'
    ? results.every(Boolean)
    : results.some(Boolean)
}

export function isConditionallyRequiredValueEmpty(value: unknown): boolean {
  if (value === undefined || value === null) {
    return true
  }
  if (typeof value === 'string') {
    return value.trim() === ''
  }
  if (Array.isArray(value)) {
    return value.length === 0
  }
  return false
}
