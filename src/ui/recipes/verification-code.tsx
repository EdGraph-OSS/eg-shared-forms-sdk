import { defineRecipe } from '@chakra-ui/react'

export const verificationCodeRecipe = defineRecipe({
  className: 'eg-verification-code-recipe',
  base: {},
  variants: {
    invalid: {
      true: {
        borderColor: 'red.500',
        _focus: { border: '2px solid red' },
      },
      false: {
        _focus: { border: '2px solid gray' },
      },
    },
  },
  defaultVariants: {
    invalid: false,
  },
})
