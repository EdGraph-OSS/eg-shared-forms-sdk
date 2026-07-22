import type { HTMLChakraProps } from '@chakra-ui/react'
import { createSlotRecipeContext, defineSlotRecipe } from '@chakra-ui/react'

export const errorListRecipe = defineSlotRecipe({
  className: 'eg-error-list-recipe',
  slots: ['container', 'heading', 'listItem'],
  base: {
    container: {
      mb: 4,
      p: 3,
      borderWidth: '1px',
      borderColor: 'red.300',
      bg: 'red.50',
      borderRadius: 'md',
      _dark: { borderColor: 'red.700', bg: 'red.950' },
    },
    heading: {
      fontSize: 'sm',
      fontWeight: 'bold',
      color: 'red.700',
      _dark: { color: 'red.200' },
      mb: 1,
    },
    listItem: {
      color: 'red.700',
      _dark: { color: 'red.200' },
      fontSize: 'sm',
    },
  },
})

const { withProvider, withContext } = createSlotRecipeContext({ key: 'errorList' })

export const ErrorListContainer = withProvider<HTMLDivElement, HTMLChakraProps<'div'>>('div', 'container')
export const ErrorListHeading = withContext<HTMLParagraphElement, HTMLChakraProps<'p'>>('p', 'heading')
