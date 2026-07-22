import { defineSlotRecipe } from '@chakra-ui/react'

export const scoringFieldRecipe = defineSlotRecipe({
  className: 'eg-scoring-field-recipe',
  slots: ['header', 'track', 'button'],
  base: {
    header: {
      color: '#4A5568',
      _dark: { color: 'gray.300' },
      fontWeight: '600',
      fontSize: 'sm',
    },
    track: {
      borderRadius: 'md',
      overflow: 'hidden',
    },
    button: {
      fontSize: 'sm',
      fontWeight: 'bold',
      borderRadius: 0,
    },
  },
  variants: {
    invalid: {
      true: {
        track: { borderWidth: '2px', borderColor: 'red.500', _dark: { borderColor: 'red.500' } },
      },
      false: {
        track: { borderWidth: '1px', borderColor: '#E2E8F0', _dark: { borderColor: 'gray.600' } },
      },
    },
    selected: {
      true: {
        button: { bg: '#2C5282', color: 'white', _dark: { bg: 'blue.600', color: 'white' } },
      },
      false: {
        button: { bg: '#E2E8F0', color: '#4A5568', _dark: { bg: 'gray.700', color: 'gray.100' } },
      },
    },
  },
  defaultVariants: {
    invalid: false,
    selected: false,
  },
})
