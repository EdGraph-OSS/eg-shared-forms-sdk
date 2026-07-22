import type { HTMLChakraProps } from '@chakra-ui/react'
import { chakra, defineRecipe } from '@chakra-ui/react'
import { useSingleRecipeStyles } from '../use-recipe-styles'

export const objectFieldCustomContainerRecipe = defineRecipe({
  className: 'eg-object-field-custom-container-recipe',
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 1,
    borderBottom: '1px solid',
    borderColor: 'gray.200',
    _dark: { borderColor: 'gray.600' },
    py: 3,
  },
})

export function ObjectFieldCustomContainer(props: HTMLChakraProps<'div'>) {
  const styles = useSingleRecipeStyles('objectFieldCustomContainer', objectFieldCustomContainerRecipe)()
  return <chakra.div css={styles} {...props} />
}
