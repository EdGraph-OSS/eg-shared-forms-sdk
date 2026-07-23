import type { HTMLChakraProps } from '@chakra-ui/react'
import { chakra, defineSlotRecipe } from '@chakra-ui/react'
import { colors } from '../theme'
import { useRecipeStyles } from '../use-recipe-styles'

export const sectionDomainRecipe = defineSlotRecipe({
  className: 'eg-section-domain-recipe',
  slots: ['root', 'header', 'heading', 'description', 'subHeading', 'properties'],
  base: {
    root: {
      borderRadius: 'sm',
      overflow: 'hidden',
      borderWidth: '1px',
      borderColor: colors.primary.light,
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

function useSectionDomainStyles() {
  return useRecipeStyles('sectionDomain', sectionDomainRecipe)()
}

function Root(props: HTMLChakraProps<'div'>) {
  const styles = useSectionDomainStyles()
  return <chakra.div css={styles.root} {...props} />
}

function Header(props: HTMLChakraProps<'div'>) {
  const styles = useSectionDomainStyles()
  return <chakra.div css={styles.header} {...props} />
}

function Heading(props: HTMLChakraProps<'h2'>) {
  const styles = useSectionDomainStyles()
  return <chakra.h2 css={styles.heading} {...props} />
}

function Description(props: HTMLChakraProps<'p'>) {
  const styles = useSectionDomainStyles()
  return <chakra.p css={styles.description} {...props} />
}

function SubHeading(props: HTMLChakraProps<'div'>) {
  const styles = useSectionDomainStyles()
  return <chakra.div css={styles.subHeading} {...props} />
}

function Properties(props: HTMLChakraProps<'div'>) {
  const styles = useSectionDomainStyles()
  return <chakra.div css={styles.properties} {...props} />
}

export const SectionDomain = { Root, Header, Heading, Description, SubHeading, Properties }
