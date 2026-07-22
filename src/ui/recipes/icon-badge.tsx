import type { HTMLChakraProps } from '@chakra-ui/react'
import { chakra, defineRecipe } from '@chakra-ui/react'
import { forwardRef } from 'react'
import { useSingleRecipeStyles } from '../use-recipe-styles'

/** Circular icon badge shared by RadioCardsField and CheckboxCardsField. */
export const iconBadgeRecipe = defineRecipe({
  className: 'eg-icon-badge-recipe',
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderRadius: 'full',
    bg: 'teal.400',
    color: 'white',
    lineHeight: 1,
  },
  variants: {
    size: {
      md: { w: '40px', h: '40px', fontSize: '20px' },
      sm: { w: '32px', h: '32px', fontSize: '16px' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface IconBadgeProps extends HTMLChakraProps<'div'> {
  size?: 'md' | 'sm'
}

export const IconBadge = forwardRef<HTMLDivElement, IconBadgeProps>(function IconBadge(
  { size, ...rest },
  ref,
) {
  const styles = useSingleRecipeStyles('iconBadge', iconBadgeRecipe)({ size })
  return <chakra.div ref={ref} css={styles} {...rest} />
})
