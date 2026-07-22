import { defineSlotRecipe } from '@chakra-ui/react'

export const dateDropdownRecipe = defineSlotRecipe({
  className: 'eg-date-dropdown-recipe',
  slots: ['columnLabel'],
  base: {
    columnLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#555',
      _dark: { color: 'gray.300' },
    },
  },
})
