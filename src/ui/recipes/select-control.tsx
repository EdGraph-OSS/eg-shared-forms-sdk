import { defineRecipe } from '@chakra-ui/react'

/** Shared Select.Control chrome for SelectFieldWidget and SectionPicker's dropdowns. */
export const selectControlRecipe = defineRecipe({
  className: 'eg-select-control-recipe',
  base: {
    fontSize: '1rem',
    borderRadius: '6px',
    bg: 'white',
    _dark: { bg: 'gray.800', color: 'gray.100' },
  },
  variants: {
    invalid: {
      true: {
        border: '2px solid red',
        _dark: { borderColor: 'red.500' },
      },
      false: {
        border: '2px solid #e9ecef',
        _dark: { borderColor: 'gray.600' },
      },
    },
    readonly: {
      true: {
        bg: '#f5f5f5',
        _dark: { bg: 'gray.700' },
      },
      false: {},
    },
  },
  defaultVariants: {
    invalid: false,
    readonly: false,
  },
})
