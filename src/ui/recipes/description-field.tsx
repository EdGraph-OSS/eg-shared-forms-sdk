import type { HTMLChakraProps } from '@chakra-ui/react'
import { chakra, defineRecipe } from '@chakra-ui/react'
import { useSingleRecipeStyles } from '../use-recipe-styles'

export const descriptionFieldRecipe = defineRecipe({
  className: 'eg-description-field-recipe',
  base: {
    fontSize: 'sm',
    color: 'blue.900',
    _dark: { color: 'gray.300' },
  },
})

export function DescriptionField(props: HTMLChakraProps<'div'>) {
  const styles = useSingleRecipeStyles('descriptionField', descriptionFieldRecipe)()
  return <chakra.div css={styles} {...props} />
}
