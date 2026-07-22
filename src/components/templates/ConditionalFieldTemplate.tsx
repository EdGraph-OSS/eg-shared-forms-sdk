import type { FieldTemplateProps } from '@rjsf/utils'
import type { ReactNode } from 'react'
import { isString } from 'lodash-es'
import { evaluateVisibilityConditions } from '../../utils/visibility-conditions'
import { ConditionalField } from '../../ui/recipes/conditional-field'

const CONDITIONAL_REVEAL_TRANSITION =
  'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out, transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)'

/** Marks the visual row inside ObjectFieldTemplate sections; border comes from parent via sx. */
const FIELD_ROW_CLASS = 'rjsf-field-row'

/** Smooth show/hide for fields driven by ui:conditions (stays mounted so CSS can animate). */
function ConditionalReveal({
  isVisible,
  children,
}: {
  isVisible: boolean
  children: ReactNode
}) {
  return (
    <div
      className={`${isVisible? 'eg-conditional-field-visible' : 'eg-conditional-field-hidden'} conditional-field-reveal`}
      style={{
        maxHeight: isVisible ? 2400 : 0,
        opacity: isVisible ? 1 : 0,
        overflow: 'hidden',
        pointerEvents: isVisible ? 'auto' : 'none',
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
        transition: CONDITIONAL_REVEAL_TRANSITION,
      }}
    >
      {children}
    </div>
  )
}

export function CustomFieldTemplate(props: FieldTemplateProps) {
  const {
    style,
    label,
    help,
    required,
    description,
    errors,
    children,
    uiSchema,
    registry,
    schema,
  } = props

  const conditions = uiSchema?.['ui:conditions'] as Parameters<typeof evaluateVisibilityConditions>[0] | undefined
  const hasConditions = !!(conditions?.rules?.length)
  const rootData = (registry.formContext as { formData?: unknown } | undefined)?.formData
  const conditionsMatch = !hasConditions || evaluateVisibilityConditions(conditions, rootData)
  const showRequiredStar = required
    || (!!uiSchema?.['ui:requiredWhenVisible'] && conditionsMatch)

  const wrapIfConditional = (node: ReactNode) =>
    hasConditions ? <ConditionalReveal isVisible={conditionsMatch}>{node}</ConditionalReveal> : node

  if (uiSchema?.['ui:widget'] === 'ImageWidget') {
    return wrapIfConditional(<div className={FIELD_ROW_CLASS}>{children}</div>)
  }

  if (schema.type === 'object') {
    return wrapIfConditional(<div className={FIELD_ROW_CLASS}>{children}</div>)
  }

  const widget = uiSchema?.['ui:widget']

  const fullWidth = isString(widget) && ![
    'HtmlWidget',
    'ImageWidget',
    'OrWidget',
    'InfoMessageWidget',
    'InfoCardWidget',
    'EmailWidget',
    'PhoneWidget',
  ].includes(widget)

  const showLabel = isString(widget) && ![
    'HtmlWidget',
    'ImageWidget',
    'OrWidget',
    'InfoMessageWidget',
    'InfoCardWidget',
  ].includes(widget)

  const showDescription = isString(widget) && ![
    'HtmlWidget',
    'ImageWidget',
    'OrWidget',
    'InfoMessageWidget',
    'InfoCardWidget',
  ].includes(widget)

  return wrapIfConditional((
    <ConditionalField.Row className={FIELD_ROW_CLASS} style={style} fullWidth={fullWidth}>
      <ConditionalField.Layout>
        <ConditionalField.LabelColumn>
          {label && showLabel && (
            <ConditionalField.Label
              className={showRequiredStar ? 'required-star' : ''}
              dangerouslySetInnerHTML={{ __html: String(label) }}
            />
          )}

          {description && showDescription && (
            <ConditionalField.Description>
              {description}
            </ConditionalField.Description>
          )}
        </ConditionalField.LabelColumn>
        <ConditionalField.FieldColumn>
          {children}
        </ConditionalField.FieldColumn>
      </ConditionalField.Layout>
      {errors}
      {help}
    </ConditionalField.Row>
  ))
}
