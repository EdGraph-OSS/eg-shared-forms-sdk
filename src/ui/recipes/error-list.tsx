import type { HTMLChakraProps } from '@chakra-ui/react'
import { chakra, defineSlotRecipe } from '@chakra-ui/react'
import { useRecipeStyles } from '../use-recipe-styles'

export const errorListRecipe = defineSlotRecipe({
  className: 'eg-error-list-recipe',
  slots: ['container', 'heading', 'listItem'],
  base: {
    container: {
      mb: 4,
      p: 3,
      borderWidth: '1px',
      borderColor: 'red.300',
      bg: 'red.50',
      borderRadius: 'md',
      _dark: { borderColor: 'red.700', bg: 'red.950' },
    },
    heading: {
      fontSize: 'sm',
      fontWeight: 'bold',
      color: 'red.700',
      _dark: { color: 'red.200' },
      mb: 1,
    },
    listItem: {
      color: 'red.700',
      _dark: { color: 'red.200' },
      fontSize: 'sm',
    },
  },
})

function useErrorListStyles() {
  return useRecipeStyles('errorList', errorListRecipe)()
}

export function ErrorListContainer(props: HTMLChakraProps<'div'>) {
  const styles = useErrorListStyles()
  return <chakra.div css={styles.container} {...props} />
}

export function ErrorListHeading(props: HTMLChakraProps<'p'>) {
  const styles = useErrorListStyles()
  return <chakra.p css={styles.heading} {...props} />
}
