import type { RJSFSchema } from '@rjsf/utils'
import { Button } from '@chakra-ui/react'
import { getSubmitButtonOptions } from '@rjsf/utils'

export default function SubmitButton(props: RJSFSchema) {
  const { uiSchema } = props
  const { norender } = getSubmitButtonOptions(uiSchema)

  if (norender) {
    return null
  }
  return (
    <Button disabled={props.readonly} bg="blue.500" _dark={{ bg: 'blue.600', borderColor: 'blue.400' }} borderWidth="1px" color="white" h="48px" fontSize="2xl" padding={15} type="submit">Submit</Button>
  )
}
