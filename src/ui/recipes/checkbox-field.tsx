import { defineSlotRecipe } from '@chakra-ui/react'

export const checkboxFieldRecipe = defineSlotRecipe({
  className: 'eg-checkbox-field-recipe',
  slots: ['container', 'control', 'label'],
  base: {
    container: {
      bg: 'white',
      _dark: { bg: 'gray.800' },
      borderWidth: '2px',
      flexDir: 'column',
      w: 'full',
      padding: '8px',
    },
    control: {
      cursor: 'pointer',
      color: 'white',
      colorPalette: 'blue',
      border: '1px solid transparent',
      borderColor: 'gray.300 !important',
      ringColor: 'var(--eg-accent)',
    },
    label: {
      cursor: 'pointer',
      fontSize: 14,
      color: 'gray.700',
      _dark: { color: 'gray.100' },
    },
  },
  variants: {
    invalid: {
      true: {
        container: { borderColor: 'red.500', _dark: { borderColor: 'red.500' } },
      },
      false: {
        container: { borderColor: '#e9ecef', _dark: { borderColor: 'gray.600' } },
      },
    },
  },
  defaultVariants: {
    invalid: false,
  },
})
