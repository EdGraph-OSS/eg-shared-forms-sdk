import type { FieldTemplateProps } from '@rjsf/utils'
import type { ReactNode } from 'react'
import {
  Box,
  Flex,
  Text,
} from '@chakra-ui/react'
import { isString } from 'lodash-es'
import { evaluateVisibilityConditions } from '../../utils/visibility-conditions'

const BODY_TEXT = '#4A5568'

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
        transition:
          'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out, transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
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
    return wrapIfConditional(<Box className={FIELD_ROW_CLASS}>{children}</Box>)
  }

  if (schema.type === 'object') {
    return wrapIfConditional(<Box className={FIELD_ROW_CLASS}>{children}</Box>)
  }

  const widget = uiSchema?.['ui:widget']

  const fullWidth = isString(widget) && ![
    'HtmlWidget',
    'ImageWidget',
    'OrWidget',
    'InfoMessageWidget',
    'InfoCardWidget',
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
    <Box className={FIELD_ROW_CLASS} style={style} py={3}>
      <Flex
        flexDir={{
          base: 'column',
          md: fullWidth ? 'row' : 'column',
        }}
        align={{
          base: 'stretch',
          md: fullWidth ? 'center' : 'stretch',
        }}
        justify="space-between"
      >
        <Box
          flex={fullWidth
            ? {
                base: 'none',
                md: 1,
              }
            : undefined}
          alignItems="center"
          minW={0}
        >
          {label && showLabel && (
            <Text
              as="label"
              color={BODY_TEXT}
              _dark={{ color: 'gray.200' }}
              fontSize="sm"
              flex={1}
              display="flex"
              alignItems="center"
              gap={1}
              className={showRequiredStar ? 'required-star' : ''}
              dangerouslySetInnerHTML={{ __html: String(label) }}
            />
          )}

          {description && showDescription && (
            <Box
              color={BODY_TEXT}
              _dark={{ color: 'gray.300' }}
              fontSize="sm"
            >
              {description}
            </Box>
          )}
        </Box>
        <Box
          flex={fullWidth
            ? {
                base: 'none',
                md: '0 0 auto',
              }
            : undefined}
            minW="390px"
        >
          {children}
        </Box>
      </Flex>
      {errors}
      {help}
    </Box>
  ))
}
