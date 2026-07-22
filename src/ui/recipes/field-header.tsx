import type { HTMLChakraProps } from '@chakra-ui/react'
import { chakra, defineRecipe } from '@chakra-ui/react'
import { forwardRef } from 'react'
import { useSingleRecipeStyles } from '../use-recipe-styles'

/** Shared "ui:header" / prompt label look used above most widget inputs. */
export const fieldHeaderRecipe = defineRecipe({
  className: 'eg-field-header-recipe',
  base: {
    color: '#333',
    _dark: { color: 'gray.200' },
    fontWeight: '600',
  },
})

export const FieldHeader = forwardRef<HTMLParagraphElement, HTMLChakraProps<'p'>>(function FieldHeader(
  props,
  ref,
) {
  const styles = useSingleRecipeStyles('fieldHeader', fieldHeaderRecipe)()
  return <chakra.p ref={ref} css={styles} {...props} />
})
