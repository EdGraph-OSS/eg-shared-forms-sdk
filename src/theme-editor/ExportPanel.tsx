import { useMemo } from 'react'
import { Box, Button, HStack } from '@chakra-ui/react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { colors } from '../ui'
import { fonts } from '../ui/theme'
import type { ProviderRecipes, ProviderSlotRecipes } from '../ui'
import type { ThemeTokens } from './useThemeEditorState'
import { recipeDefaults, slotRecipeDefaults } from './recipe-registry'
import { chrome } from './chromeColors'

const extensions = [json()]

interface ExportPanelProps {
  recipes: ProviderRecipes
  slotRecipes: ProviderSlotRecipes
  tokens: ThemeTokens
  themeName: string
  themeVersion: string
}

// Colors/fonts are wrapped in Chakra's `{ value }` token format (matching `tokens.colors`/
// `tokens.fonts` in `Provider`) and nested under `tokens`, so the exported JSON is shaped
// exactly like `ProviderProps` — pasting it straight into `<Provider {...theme} />` is enough
// on its own, no reshaping required.
function mergeColors(tokens: ThemeTokens): Record<string, Record<string, { value: string }>> {
  const overrides = tokens.colors as Record<string, Record<string, { value: string }>> | undefined
  const merged: Record<string, Record<string, { value: string }>> = Object.fromEntries(
    Object.entries(colors).map(([scale, shades]) => [
      scale,
      Object.fromEntries(
        Object.keys(shades).map(shade => [
          shade,
          { value: overrides?.[scale]?.[shade]?.value ?? (shades as Record<string, string>)[shade] },
        ]),
      ),
    ]),
  )

  for (const [scale, shades] of Object.entries(overrides ?? {})) {
    merged[scale] = merged[scale] ?? {}
    for (const [shade, token] of Object.entries(shades)) {
      merged[scale][shade] = { value: token.value }
    }
  }

  return merged
}

// A font token's `href` (e.g. picked via the Google Fonts selector) is folded in alongside
// its `value` — the package defaults don't carry one, since they're bundled at build time
// via @fontsource.
function mergeFonts(tokens: ThemeTokens): Record<string, { value: string; href?: string }> {
  const overrides = tokens.fonts as Record<string, { value: string; href?: string }> | undefined
  return Object.fromEntries(
    Object.keys(fonts).map(key => {
      const override = overrides?.[key]
      return [
        key,
        {
          value: override?.value ?? (fonts as Record<string, string>)[key],
          ...(override?.href ? { href: override.href } : {}),
        },
      ]
    }),
  )
}

export function ExportPanel({ recipes, slotRecipes, tokens, themeName, themeVersion }: ExportPanelProps) {
  const canExport = themeName.trim().length > 0 && themeVersion.trim().length > 0

  const code = useMemo(() => {
    const theme = {
      // Editor-only metadata, ignored by `Provider` — carried along so the
      // theme editor's "Load theme" file field can restore the name/version
      // fields alongside the recipes/slotRecipes/tokens below.
      meta: { name: themeName, version: themeVersion },
      recipes: { ...recipeDefaults, ...recipes },
      slotRecipes: { ...slotRecipeDefaults, ...slotRecipes },
      tokens: {
        colors: mergeColors(tokens),
        fonts: mergeFonts(tokens),
      },
    }
    return JSON.stringify(theme, null, 2)
  }, [recipes, slotRecipes, tokens, themeName, themeVersion])

  const handleExport = () => {
    if (!canExport) return
    const slug = themeName.trim().replace(/\s+/g, '-')
    const blob = new Blob([code], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${slug}-v${themeVersion.trim()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Box>
      <HStack mt='32px' justify="space-between" mb={2}>
        <Box 
          fontWeight="semibold" 
          fontSize="xl" 
          color={chrome.text}>Custom Theme</Box>
        <Button
          bg={chrome.primaryBrand}
          color="white"
          fontWeight='bold'
          size="xs"
          w='150px'
          _hover={{ bg: chrome.buttonBgHover }}
          _disabled={{ opacity: 0.5, cursor: 'not-allowed', _hover: { bg: chrome.buttonBg } }}
          disabled={!canExport}
          title={canExport ? undefined : 'Enter a theme name and version before exporting'}
          onClick={handleExport}>Export</Button>
      </HStack>
      <Box
        borderRadius='md'
        maxH="480px"
        overflowY="auto"
        fontSize="xs"
        bg={chrome.panelBg}
        borderWidth="1px"
        borderColor={chrome.border}
        _hover={{ borderColor: chrome.primaryBrand, boxShadow: `0 0 3px ${chrome.primaryBrand}` }}>
        <CodeMirror
          value={code}
          extensions={extensions}
          editable={false}
          basicSetup={{ highlightActiveLine: false }} />
      </Box>
    </Box>
  )
}
