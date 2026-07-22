import { defineSlotRecipe } from '@chakra-ui/react'

export const infoCardRecipe = defineSlotRecipe({
  className: 'eg-info-card-recipe',
  slots: ['container', 'title'],
  base: {
    container: {
      color: '#333',
      _dark: { color: 'gray.100' },
      bg: '#e8f7f8',
      border: '1px solid #4bbcc4',
      borderRadius: '12px',
      padding: '20px 24px',
    },
    title: {
      fontWeight: '700',
      fontSize: '1.125rem',
      color: '#1799a6',
      _dark: { color: 'teal.200' },
    },
  },
})