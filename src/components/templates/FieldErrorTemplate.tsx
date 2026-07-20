import type { FieldErrorProps } from '@rjsf/utils'
import { Text } from '@chakra-ui/react'

export default function FieldErrorTemplate(props: FieldErrorProps) {
  const errors = props.errors ?? []
  if (!errors.length) {
    return null
  }

  return (
    <>
      {errors.map((error, index) => (
        <Text className='eg-field-error-template' key={`${String(error)}-${index}`} mt={1} color="red.500" fontSize="sm">
          {String(error)}
        </Text>
      ))}
    </>
  )
}
