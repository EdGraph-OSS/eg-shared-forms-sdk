import type { HTMLChakraProps } from '@chakra-ui/react'
import { createSlotRecipeContext, defineSlotRecipe } from '@chakra-ui/react'
import { colors } from '../theme'

export const sectionDomainRecipe = defineSlotRecipe({
  className: 'eg-section-domain-recipe',
  slots: ['root', 'header', 'heading', 'description', 'subHeading', 'properties'],
  base: {
    root: {
      borderRadius: 'sm',
      overflow: 'hidden',
      borderWidth: '1px',
      borderColor: 'primary',
      _dark: { borderColor: 'gray.600' },
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      bg: colors.primary.light,
      _dark: { bg: colors.primary.dark },
      color: 'white',
      px: 2,
      py: 2,
    },
    heading: {
      fontFamily: 'heading',
      textStyle: 'lg',
      fontWeight: 'bold',
      color: 'white',
    },
    description: {
      fontSize: 'sm',
      fontWeight: 'normal',
      color: 'whiteAlpha.900',
    },
    subHeading: {
      color: 'white',
      background: colors.primary.dark,
      _dark: { color: 'gray.100', background: 'gray.700' },
      px: 2,
      py: 1,
      fontSize: 'sm',
    },
    properties: {
      bg: 'white',
      _dark: { bg: 'gray.800' },
      px: 4,
      py: 2,
      minH: '100px',
    },
  },
})

const { withProvider, withContext } = createSlotRecipeContext({ key: 'sectionDomain' })

export const SectionDomain = {
  Root: withProvider<HTMLDivElement, HTMLChakraProps<'div'>>('div', 'root'),
  Header: withContext<HTMLDivElement, HTMLChakraProps<'div'>>('div', 'header'),
  Heading: withContext<HTMLHeadingElement, HTMLChakraProps<'h2'>>('h2', 'heading'),
  Description: withContext<HTMLParagraphElement, HTMLChakraProps<'p'>>('p', 'description'),
  SubHeading: withContext<HTMLDivElement, HTMLChakraProps<'div'>>('div', 'subHeading'),
  Properties: withContext<HTMLDivElement, HTMLChakraProps<'div'>>('div', 'properties'),
}
