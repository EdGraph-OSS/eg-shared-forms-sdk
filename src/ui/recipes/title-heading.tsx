import type { HTMLChakraProps } from '@chakra-ui/react'
import { chakra, defineRecipe } from '@chakra-ui/react'
import { useSingleRecipeStyles } from '../use-recipe-styles'

/**
 * Standalone recipe (not an override of Chakra's built-in `heading` recipe) so we don't
 * restyle every <Heading/> in a consuming app. `textStyle`/`fontFamily` in the
 * `standalone` variant replicate what Heading's own `size="xl"` would have applied,
 * since we render a raw <h1/> here instead of Chakra's <Heading/>.
 */
export const titleHeadingRecipe = defineRecipe({
  className: 'eg-title-heading-recipe',
  base: {
    fontFamily: 'heading',
    fontWeight: 'bold',
    mb: 4,
    mt: 0,
    color: '#1A365D',
    _dark: { color: 'gray.100' },
  },
  variants: {
    variant: {
      standalone: {
        textStyle: 'xl',
        textAlign: 'center',
      },
      root: {
        fontSize: '2xl',
      },
    },
  },
  defaultVariants: {
    variant: 'standalone',
  },
})

interface TitleHeadingProps extends HTMLChakraProps<'h1'> {
  variant?: 'standalone' | 'root'
}

export function TitleHeading({ variant, ...rest }: TitleHeadingProps) {
  const styles = useSingleRecipeStyles('titleHeading', titleHeadingRecipe)({ variant })
  return <chakra.h1 css={styles} {...rest} />
}
