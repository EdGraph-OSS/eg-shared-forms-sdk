import { defineRecipe } from '@chakra-ui/react'

export const infoMessageRecipe = defineRecipe({
  className: 'eg-info-message-recipe',
  base: {
    color: '#333',
    _dark: { color: 'gray.100' },
    fontSize: '0.9375rem',
    lineHeight: 1.6,
    bg: '#fff3cd',
    borderLeft: '4px solid #ffc107',
    borderRadius: '4px',
    padding: '16px',
  },
})
