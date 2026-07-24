import type { DescriptionFieldProps } from '@rjsf/utils'
import { DescriptionField } from '../../ui/recipes/description-field'

export default function DescriptionFieldTemplate(props: DescriptionFieldProps) {
  return (
    <DescriptionField
      className="eg-description-field-template HtmlContent"
      dangerouslySetInnerHTML={{ __html: String(props.description) }}
    />
  )
}
