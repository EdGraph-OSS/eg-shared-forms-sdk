import { defineSlotRecipe } from '@chakra-ui/react'

export const dividerFieldRecipe = defineSlotRecipe({
  className: 'eg-divider-field-recipe',
  slots: ['line', 'label'],
  base: {
    line: {
      bg: '#e9ecef',
      _dark: { bg: 'gray.600' },
    },
    label: {
      fontSize: 'sm',
      fontWeight: '600',
      textTransform: 'uppercase',
      color: 'gray.500',
      _dark: { color: 'gray.400' },
    },
  },
})
