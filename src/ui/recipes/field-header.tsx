import type { HTMLChakraProps } from '@chakra-ui/react'
import { createRecipeContext, defineRecipe } from '@chakra-ui/react'

/** Shared "ui:header" / prompt label look used above most widget inputs. */
export const fieldHeaderRecipe = defineRecipe({
  className: 'eg-field-header-recipe',
  base: {
    color: '#333',
    _dark: { color: 'gray.200' },
    fontWeight: '600',
  },
})

const { withContext } = createRecipeContext({ key: 'fieldHeader' })

export const FieldHeader = withContext<HTMLParagraphElement, HTMLChakraProps<'p'>>('p')
