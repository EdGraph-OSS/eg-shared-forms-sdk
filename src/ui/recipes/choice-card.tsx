import { defineSlotRecipe } from '@chakra-ui/react'

/** Card label/description look shared by RadioCardsField and CheckboxCardsField. */
export const choiceCardRecipe = defineSlotRecipe({
  className: 'eg-choice-card-recipe',
  slots: ['label', 'description'],
  base: {
    label: {
      fontWeight: '700',
    },
    description: {
      color: 'gray.500',
      _dark: { color: 'gray.400' },
    },
  },
  variants: {
    sub: {
      true: { label: { fontSize: '15px' } },
      false: { label: { fontSize: '16px' } },
    },
  },
  defaultVariants: {
    sub: false,
  },
})
