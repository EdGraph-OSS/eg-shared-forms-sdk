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

export default function HtmlFieldWidget<T = any, S extends StrictRJSFSchema = RJSFSchema>({
  id,
  schema,
  value,
}: WidgetProps<T, S>) {
  const htmlContent = value ?? schema.default ?? ''

  return (
    <Field.Root id={id} className='eg-html-field-widget'>
      <Flex flexDir="column" w="full" mt={1}>
        {htmlContent && (
          <div
            className="prose prose-sm max-w-none prose-neutral dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: String(htmlContent) }}
          />
        )}
      </Flex>
    </Field.Root>
  )
}
