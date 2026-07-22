import type { HTMLChakraProps } from '@chakra-ui/react'
import { chakra, defineRecipe } from '@chakra-ui/react'
import { useSingleRecipeStyles } from '../use-recipe-styles'

export const fieldErrorRecipe = defineRecipe({
  className: 'eg-field-error-recipe',
  base: {
    mt: 1,
    color: 'red.500',
    fontSize: 'sm',
  },
})

export function FieldError(props: HTMLChakraProps<'p'>) {
  const styles = useSingleRecipeStyles('fieldError', fieldErrorRecipe)()
  return <chakra.p css={styles} {...props} />
}
