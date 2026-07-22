import { defineSlotRecipe } from '@chakra-ui/react'

export const contactVerificationRecipe = defineSlotRecipe({
  className: 'eg-contact-verification-recipe',
  slots: ['container', 'title'],
  base: {
    container: {
      color: '#333',
      _dark: { color: 'gray.100' },
      bg: '#fdeef0',
      border: '1px solid #e8a3ad',
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
