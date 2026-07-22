import type { RJSFSchema } from '@rjsf/utils'
import { getSubmitButtonOptions } from '@rjsf/utils'
import { SubmitButtonBase } from '../../ui/recipes/submit-button'

export default function SubmitButton(props: RJSFSchema) {
  const { uiSchema } = props
  const { norender } = getSubmitButtonOptions(uiSchema)

  if (norender) {
    return null
  }
  return (
    <SubmitButtonBase disabled={props.readonly} type="submit">Submit</SubmitButtonBase>
  )
}
