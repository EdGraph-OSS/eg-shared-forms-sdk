import type {
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from '@rjsf/utils'
import {
  Field,
  Flex,
  Text,
} from '@chakra-ui/react'

export default function ImageFieldWidget<T = any, S extends StrictRJSFSchema = RJSFSchema>({
  id,
  schema,
  value,
  uiSchema,
}: WidgetProps<T, S>) {
  const imageUrl = value ?? schema.default ?? ''
  const title = schema.title
  const altText = schema.description ?? uiSchema?.['ui:options']?.alt ?? ''

  return (
    <Field.Root id={id} className='eg-image-field-widget'>
      <Flex flexDir="column" w="full" mt={1}>
        {title && (
          <Text fontWeight="bold" fontSize="sm" color="#4A5568" _dark={{ color: 'gray.100' }} mb={1} dangerouslySetInnerHTML={{ __html: String(title) }} />
        )}
        {imageUrl && (
          <Flex as="figure" flexDir="column" gap={2} alignItems="flex-start">
            <img
              className='eg-image'
              src={String(imageUrl)}
              alt={altText || 'Form image'}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '6px',
              }}
            />
            {altText && (
              <Text as="figcaption" fontSize="sm" color="gray.600" _dark={{ color: 'gray.300' }} dangerouslySetInnerHTML={{ __html: String(altText) }} />
            )}
          </Flex>
        )}
      </Flex>
    </Field.Root>
  )
}
