import type { FieldErrorProps } from '@rjsf/utils'
import { FieldError } from '../../ui/recipes/field-error'

export default function FieldErrorTemplate(props: FieldErrorProps) {
  const errors = props.errors ?? []
  if (!errors.length) {
    return null
  }

  return (
    <>
      {errors.map((error, index) => (
        <FieldError className='eg-field-error-template' key={`${String(error)}-${index}`}>
          {String(error)}
        </FieldError>
      ))}
    </>
  )
}
