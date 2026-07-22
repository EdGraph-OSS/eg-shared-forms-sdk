import type { HTMLChakraProps } from '@chakra-ui/react'
import { createRecipeContext, defineRecipe } from '@chakra-ui/react'

export const formDescriptionRecipe = defineRecipe({
  className: 'eg-form-description-recipe',
  base: {
    fontSize: 'sm',
  },
  variants: {
    variant: {
      root: {
        lineHeight: '1.6',
        mb: 4,
        color: 'gray.600',
        _dark: { color: 'gray.300' },
      },
      custom: {
        fontWeight: 'normal',
        color: 'gray.500',
        _dark: { color: 'gray.300' },
      },
    },
  },
})

interface FormDescriptionProps extends HTMLChakraProps<'p'> {
  variant: 'root' | 'custom'
}

const { withContext } = createRecipeContext({ key: 'formDescription' })

export const FormDescription = withContext<HTMLParagraphElement, FormDescriptionProps>('p')
