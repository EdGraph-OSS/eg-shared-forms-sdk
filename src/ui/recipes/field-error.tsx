import type { HTMLChakraProps } from '@chakra-ui/react'
import { createRecipeContext, defineRecipe } from '@chakra-ui/react'

export const fieldErrorRecipe = defineRecipe({
  className: 'eg-field-error-recipe',
  base: {
    mt: 1,
    color: 'red.500',
    fontSize: 'sm',
  },
})

const { withContext } = createRecipeContext({ key: 'fieldError' })

export const FieldError = withContext<HTMLParagraphElement, HTMLChakraProps<'p'>>('p')
