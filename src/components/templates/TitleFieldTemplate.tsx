import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  TitleFieldProps,
} from '@rjsf/utils'
import { Heading } from '@chakra-ui/react'

const styles = {
  heading: {
    size: 'xl',
    fontWeight: 'bold',
    color: '#1A365D',
    _dark: { color: 'gray.100' },
    textAlign: 'center',
    mb: 4,
    mt: 0,
  },
} as const

export default function TitleFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: TitleFieldProps<T, S, F>) {
  const { id, title, required } = props
  if (!title) { return null }
  return (
    <Heading
      className='eg-title-field'
      id={id}
      as="h1"
      {...styles.heading}>
      {title}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Heading>
  )
}
