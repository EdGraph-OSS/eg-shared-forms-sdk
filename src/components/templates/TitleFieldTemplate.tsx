import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  TitleFieldProps,
} from '@rjsf/utils'
import { TitleHeading } from '../../ui/recipes/title-heading'

export default function TitleFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: TitleFieldProps<T, S, F>) {
  const { id, title, required } = props
  if (!title) { return null }
  return (
    <TitleHeading className='eg-title-field' id={id} variant="standalone">
      {title}
      {required && <span className="text-red-500 ml-1">*</span>}
    </TitleHeading>
  )
}
