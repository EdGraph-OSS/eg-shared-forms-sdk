import type { HTMLChakraProps } from '@chakra-ui/react'
import { createSlotRecipeContext, defineSlotRecipe } from '@chakra-ui/react'

export const conditionalFieldRecipe = defineSlotRecipe({
  className: 'eg-conditional-field-recipe',
  slots: ['row', 'layout', 'labelColumn', 'label', 'description', 'fieldColumn'],
  base: {
    row: {
      py: 3,
    },
    layout: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    labelColumn: {
      alignItems: 'center',
      minWidth: 0,
    },
    label: {
      color: '#4A5568',
      _dark: { color: 'gray.200' },
      fontSize: 'sm',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    },
    description: {
      color: '#4A5568',
      _dark: { color: 'gray.300' },
      fontSize: 'sm',
    },
    fieldColumn: {
      minWidth: '390px',
    },
  },
  variants: {
    fullWidth: {
      true: {
        layout: {
          flexDirection: { base: 'column', md: 'row' },
          alignItems: { base: 'stretch', md: 'center' },
        },
        labelColumn: {
          flex: { base: 'none', md: 1 },
        },
        fieldColumn: {
          flex: { base: 'none', md: '0 0 auto' },
        },
      },
      false: {
        layout: {
          flexDirection: 'column',
          alignItems: 'stretch',
        },
        labelColumn: {
          width: 'full',
        },
        fieldColumn: {
          width: 'full',
        },
      },
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
})

interface ConditionalFieldRootProps extends HTMLChakraProps<'div'> {
  fullWidth?: boolean
}

const { withProvider, withContext } = createSlotRecipeContext({ key: 'conditionalField' })

export const ConditionalField = {
  Row: withProvider<HTMLDivElement, ConditionalFieldRootProps>('div', 'row'),
  Layout: withContext<HTMLDivElement, HTMLChakraProps<'div'>>('div', 'layout'),
  LabelColumn: withContext<HTMLDivElement, HTMLChakraProps<'div'>>('div', 'labelColumn'),
  Label: withContext<HTMLLabelElement, HTMLChakraProps<'label'>>('label', 'label'),
  Description: withContext<HTMLDivElement, HTMLChakraProps<'div'>>('div', 'description'),
  FieldColumn: withContext<HTMLDivElement, HTMLChakraProps<'div'>>('div', 'fieldColumn'),
}
