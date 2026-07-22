import type { HTMLChakraProps } from '@chakra-ui/react'
import { chakra, defineRecipe } from '@chakra-ui/react'
import { useSingleRecipeStyles } from '../use-recipe-styles'

/**
 * Standalone recipe (not an override of Chakra's built-in `button` recipe) so we don't
 * change every <Button/> in a consuming app. Base replicates Button's essential
 * interactive affordances (focus ring, disabled state, cursor) since we render a raw
 * <button/> here instead of Chakra's <Button/>.
 */
export const submitButtonRecipe = defineRecipe({
  className: 'eg-submit-button-recipe',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    appearance: 'none',
    userSelect: 'none',
    cursor: 'button',
    borderRadius: 'l2',
    fontWeight: 'medium',
    transitionProperty: 'common',
    transitionDuration: 'moderate',
    focusVisibleRing: 'outside',
    _disabled: { layerStyle: 'disabled' },
    bg: 'blue.500',
    _dark: { bg: 'blue.600', borderColor: 'blue.400' },
    borderWidth: '1px',
    color: 'white',
    h: '48px',
    fontSize: '2xl',
    padding: 15,
  },
})

export function SubmitButtonBase(props: HTMLChakraProps<'button'>) {
  const styles = useSingleRecipeStyles('submitButton', submitButtonRecipe)()
  return <chakra.button css={styles} {...props} />
}
