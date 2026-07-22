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
import { imageFieldRecipe } from '../../ui/recipes/image-field'
import { useRecipeStyles } from '../../ui/use-recipe-styles'

export default function ImageFieldWidget<T = any, S extends StrictRJSFSchema = RJSFSchema>({
  id,
  schema,
  value,
  uiSchema,
}: WidgetProps<T, S>) {
  const imageUrl = value ?? schema.default ?? ''
  const title = schema.title
  const altText = schema.description ?? uiSchema?.['ui:options']?.alt ?? ''

  const styles = useRecipeStyles('imageField', imageFieldRecipe)()

  return (
    <Field.Root id={id} className='eg-image-field-widget'>
      <Flex flexDir="column" w="full" mt={1}>
        {title && (
          <Text css={styles.title} mb={1} dangerouslySetInnerHTML={{ __html: String(title) }} />
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
              <Text as="figcaption" css={styles.caption} dangerouslySetInnerHTML={{ __html: String(altText) }} />
            )}
          </Flex>
        )}
      </Flex>
    </Field.Root>
  )
}
