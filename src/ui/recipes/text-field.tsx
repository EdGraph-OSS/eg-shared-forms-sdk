import { defineRecipe } from '@chakra-ui/react'

/**
 * Shared "field chrome" (bg/border/radius/font) consumed via `useRecipe` rather than
 * `withContext`, since it's applied to several different tags (Input, Textarea,
 * NativeSelect.Field, a plain Flex) across widgets that each keep their own layout props.
 */
export const textFieldRecipe = defineRecipe({
  className: 'eg-text-field-recipe',
  base: {
    fontSize: '1rem',
    borderRadius: '6px',
    bg: 'white',
    _dark: { bg: 'gray.800', color: 'gray.100' },
    outline: 'none',
  },
  variants: {
    invalid: {
      true: {
        border: '2px solid red',
        _dark: { borderColor: 'red.500' },
        _focus: { border: '2px solid red' },
      },
      false: {
        border: '2px solid #e9ecef',
        _dark: { borderColor: 'gray.600' },
        _focus: { border: '2px solid gray' },
      },
    },
  },
  defaultVariants: {
    invalid: false,
  },
})
