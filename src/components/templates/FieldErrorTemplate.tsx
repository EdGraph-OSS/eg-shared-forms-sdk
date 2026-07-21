import type { FieldErrorProps } from '@rjsf/utils'
import { Text } from '@chakra-ui/react'

const styles = {
  error: {
    mt: 1,
    color: 'red.500',
    fontSize: 'sm',
  },
} as const

export default function FieldErrorTemplate(props: FieldErrorProps) {
  const errors = props.errors ?? []
  if (!errors.length) {
    return null
  }

  return (
    <>
      {errors.map((error, index) => (
        <Text className='eg-field-error-template' key={`${String(error)}-${index}`} {...styles.error}>
          {String(error)}
        </Text>
      ))}
    </>
  )
}
