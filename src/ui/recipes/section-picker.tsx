import { defineSlotRecipe } from '@chakra-ui/react'

export const sectionPickerRecipe = defineSlotRecipe({
  className: 'eg-section-picker-recipe',
  slots: ['groupLabel', 'error'],
  base: {
    groupLabel: {
      fontSize: '0.875rem',
      color: '#666',
      _dark: { color: 'gray.400' },
    },
    error: {
      color: 'red.500',
      _dark: { color: 'red.300' },
      fontSize: 'sm',
    },
  },
})
