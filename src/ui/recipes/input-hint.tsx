import { defineSlotRecipe } from '@chakra-ui/react'

export const inputHintRecipe = defineSlotRecipe({
  className: 'eg-input-hint-recipe',
  slots: ['min', 'count'],
  base: {
    min: {
      fontSize: 'xs',
      color: 'gray.500',
      _dark: { color: 'gray.400' },
    },
    count: {
      fontSize: 'xs',
      color: 'gray.500',
      _dark: { color: 'gray.400' },
    },
  },
  variants: {
    exceeded: {
      true: {
        count: { color: 'red.500', _dark: { color: 'red.400' } },
      },
      false: {},
    },
  },
  defaultVariants: {
    exceeded: false,
  },
})
