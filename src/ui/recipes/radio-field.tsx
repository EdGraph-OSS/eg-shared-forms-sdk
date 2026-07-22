import { defineSlotRecipe } from '@chakra-ui/react'

export const radioFieldRecipe = defineSlotRecipe({
  className: 'eg-radio-field-recipe',
  slots: ['container', 'indicator', 'text'],
  base: {
    container: {
      bg: 'white',
      flexDir: 'column',
      w: 'full',
    },
    indicator: {
      cursor: 'pointer',
      color: 'white',
      colorPalette: 'blue',
      border: '1px solid transparent',
      borderColor: 'gray.300 !important',
      ringColor: 'var(--eg-accent)',
    },
    text: {
      cursor: 'pointer',
      fontSize: 14,
      color: 'gray.700',
      _dark: { color: 'gray.100' },
    },
  },
})
