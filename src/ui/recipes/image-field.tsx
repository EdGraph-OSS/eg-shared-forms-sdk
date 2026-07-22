import { defineSlotRecipe } from '@chakra-ui/react'

export const imageFieldRecipe = defineSlotRecipe({
  className: 'eg-image-field-recipe',
  slots: ['title', 'caption'],
  base: {
    title: {
      fontWeight: 'bold',
      fontSize: 'sm',
      color: '#4A5568',
      _dark: { color: 'gray.100' },
    },
    caption: {
      fontSize: 'sm',
      color: 'gray.600',
      _dark: { color: 'gray.300' },
    },
  },
})
