import type { DescriptionFieldProps } from '@rjsf/utils'

const styles = {
  description: 'HtmlContent text-sm text-gray-500 dark:text-gray-300',
}

export default function DescriptionFieldTemplate(props: DescriptionFieldProps) {
  return (
    <div className={`eg-description-field-template ${styles.description}`} dangerouslySetInnerHTML={{ __html: String(props.description) }} />
  )
}
