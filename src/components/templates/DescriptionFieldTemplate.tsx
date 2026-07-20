import type { DescriptionFieldProps } from '@rjsf/utils'

export default function DescriptionFieldTemplate(props: DescriptionFieldProps) {
  return (
    <div className="eg-description-field-template HtmlContent text-sm text-gray-500 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: String(props.description) }} />
  )
}
