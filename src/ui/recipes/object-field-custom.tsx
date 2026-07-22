import type { HTMLChakraProps } from '@chakra-ui/react'
import { createRecipeContext, defineRecipe } from '@chakra-ui/react'

export const objectFieldCustomContainerRecipe = defineRecipe({
  className: 'eg-object-field-custom-container-recipe',
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 1,
    borderBottom: '1px solid',
    borderColor: 'gray.200',
    _dark: { borderColor: 'gray.600' },
    py: 3,
  },
})

const { withContext } = createRecipeContext({ key: 'objectFieldCustomContainer' })

export const ObjectFieldCustomContainer = withContext<HTMLDivElement, HTMLChakraProps<'div'>>('div')
