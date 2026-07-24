import { useMemo, useState } from 'react'
import { Box, Button, Code, HStack } from '@chakra-ui/react'
import { colors } from '../ui'
import { fonts } from '../ui/theme'
import type { ProviderRecipes, ProviderSlotRecipes } from '../ui'
import type { ThemeTokens } from './useThemeEditorState'
import { recipeDefaults, slotRecipeDefaults } from './recipe-registry'

interface ExportPanelProps {
  recipes: ProviderRecipes
  slotRecipes: ProviderSlotRecipes
  tokens: ThemeTokens
}

function mergeColors(tokens: ThemeTokens): Record<string, Record<string, string>> {
  const overrides = tokens.colors as Record<string, Record<string, { value: string }>> | undefined
  return Object.fromEntries(
    Object.entries(colors).map(([scale, shades]) => [
      scale,
      Object.fromEntries(
        Object.keys(shades).map(shade => [
          shade,
          overrides?.[scale]?.[shade]?.value ?? (shades as Record<string, string>)[shade],
        ]),
      ),
    ]),
  )
}

function mergeFonts(tokens: ThemeTokens): Record<string, string> {
  const overrides = tokens.fonts as Record<string, { value: string }> | undefined
  return Object.fromEntries(
    Object.keys(fonts).map(key => [key, overrides?.[key]?.value ?? (fonts as Record<string, string>)[key]]),
  )
}

export function ExportPanel({ recipes, slotRecipes, tokens }: ExportPanelProps) {
  const code = useMemo(() => {
    const theme = {
      colors: mergeColors(tokens),
      fonts: mergeFonts(tokens),
      recipes: { ...recipeDefaults, ...recipes },
      slotRecipes: { ...slotRecipeDefaults, ...slotRecipes },
    }
    return JSON.stringify(theme, null, 2)
  }, [recipes, slotRecipes, tokens])

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Box>
      <HStack justify="space-between" mb={2}>
        <Box fontWeight="semibold" fontSize="sm">Exported theme</Box>
        <Button size="xs" onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</Button>
      </HStack>
      <Code as="pre" display="block" whiteSpace="pre" overflowX="auto" maxH="240px" overflowY="auto" p={3} fontSize="xs">
        {code}
      </Code>
    </Box>
  )
}
