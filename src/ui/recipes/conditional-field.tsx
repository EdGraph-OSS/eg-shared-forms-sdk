import type { HTMLChakraProps } from '@chakra-ui/react'
import { chakra, defineSlotRecipe } from '@chakra-ui/react'
import { createContext, useContext } from 'react'
import { useRecipeStyles } from '../use-recipe-styles'

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

type ConditionalFieldSlot = 'row' | 'layout' | 'labelColumn' | 'label' | 'description' | 'fieldColumn'
type ConditionalFieldStyles = Record<ConditionalFieldSlot, Record<string, unknown> | undefined>

const ConditionalFieldStylesContext = createContext<ConditionalFieldStyles | null>(null)

function useSlotStyles(slot: ConditionalFieldSlot) {
  const styles = useContext(ConditionalFieldStylesContext)
  return styles?.[slot]
}

function Row({ fullWidth, ...rest }: ConditionalFieldRootProps) {
  const recipeFn = useRecipeStyles('conditionalField', conditionalFieldRecipe)
  const styles = recipeFn({ fullWidth }) as ConditionalFieldStyles
  return (
    <ConditionalFieldStylesContext.Provider value={styles}>
      <chakra.div css={styles.row} {...rest} />
    </ConditionalFieldStylesContext.Provider>
  )
}

function Layout(props: HTMLChakraProps<'div'>) {
  return <chakra.div css={useSlotStyles('layout')} {...props} />
}

function LabelColumn(props: HTMLChakraProps<'div'>) {
  return <chakra.div css={useSlotStyles('labelColumn')} {...props} />
}

function Label(props: HTMLChakraProps<'label'>) {
  return <chakra.label css={useSlotStyles('label')} {...props} />
}

function Description(props: HTMLChakraProps<'div'>) {
  return <chakra.div css={useSlotStyles('description')} {...props} />
}

function FieldColumn(props: HTMLChakraProps<'div'>) {
  return <chakra.div css={useSlotStyles('fieldColumn')} {...props} />
}

export const ConditionalField = { Row, Layout, LabelColumn, Label, Description, FieldColumn }
