import type {
  FieldTemplateProps,
  RJSFSchema,
} from '@rjsf/utils'
import {
  Box,
  Flex,
  Text,
} from '@chakra-ui/react'
import { isString } from 'lodash-es'


export function CustomFieldTemplate(props: FieldTemplateProps) {
  const { id, style, label, help, required, description, errors, children, uiSchema } = props
  if (uiSchema?.['ui:widget'] === 'ImageWidget') {
    return <Box>{children}</Box>
  }
  if (props.schema.type === 'object') {
    return <Box>{children}</Box>
  }

  const fullWidth = isString(uiSchema?.['ui:widget']) && ![
    'HtmlWidget',
    'ImageWidget',
    'OrWidget',
    'InfoMessageWidget',
    'InfoCardWidget',
  ].includes(uiSchema?.['ui:widget'])

  const showLabel = isString(uiSchema?.['ui:widget']) && ![
    'HtmlWidget',
    'ImageWidget',
    'OrWidget',
    'InfoMessageWidget',
    'InfoCardWidget',
  ].includes(uiSchema?.['ui:widget'])

  const showDescription = isString(uiSchema?.['ui:widget']) && ![
    'HtmlWidget',
    'ImageWidget',
    'OrWidget',
    'InfoMessageWidget',
    'InfoCardWidget',
  ].includes(uiSchema?.['ui:widget'])

  return (
    <Box className='eg-field-template' style={style} py={3}>
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
              fontWeight="bold"
              color="#4A5568"
              _dark={{ color: 'gray.100' }}
              fontSize="sm"
              display="block"
            >
              {label}
              {required && <Text as="span" color="red.500" ml={1}>*</Text>}
            </Text>
          )}
          {description && showDescription && (isString(description)
            ? (
                <Box className="HtmlContent text-sm" color="gray.600" _dark={{ color: 'gray.100' }} dangerouslySetInnerHTML={{ __html: String(description) }} />
              )
            : (
                <Text className="text-sm" color="gray.600" _dark={{ color: 'gray.300' }}>
                  {description}
                </Text>
              ))}
        </Box>
        <Box flex={fullWidth
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
  )
}
