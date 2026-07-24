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

function mergeColors(tokens: ThemeTokens): Record<string, Record<string, string>> {
  const overrides = tokens.colors as Record<string, Record<string, { value: string }>> | undefined
  const merged: Record<string, Record<string, string>> = Object.fromEntries(
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

  for (const [scale, shades] of Object.entries(overrides ?? {})) {
    merged[scale] = merged[scale] ?? {}
    for (const [shade, token] of Object.entries(shades)) {
      merged[scale][shade] = token.value
    }
  }

  return merged
}

function mergeFonts(tokens: ThemeTokens): Record<string, string> {
  const overrides = tokens.fonts as Record<string, { value: string }> | undefined
  return Object.fromEntries(
    Object.keys(fonts).map(key => [key, overrides?.[key]?.value ?? (fonts as Record<string, string>)[key]]),
  )
}

// Only custom fonts (e.g. picked via the Google Fonts selector) carry an `href` —
// the package defaults don't, since they're bundled at build time via @fontsource.
// Surfacing it here means pasting this export's `tokens` back into `Provider` is
// enough for the font to actually render, not just resolve to the CSS string.
function mergeFontFaces(tokens: ThemeTokens): Record<string, string> {
  const overrides = tokens.fonts as Record<string, { value: string; href?: string }> | undefined
  return Object.fromEntries(
    Object.entries(overrides ?? {}).flatMap(([key, token]) => (token?.href ? [[key, token.href]] : [])),
  )
}

export function ExportPanel({ recipes, slotRecipes, tokens, themeName, themeVersion }: ExportPanelProps) {
  const canExport = themeName.trim().length > 0 && themeVersion.trim().length > 0

  const code = useMemo(() => {
    const fontFaces = mergeFontFaces(tokens)
    const theme = {
      colors: mergeColors(tokens),
      fonts: mergeFonts(tokens),
      ...(Object.keys(fontFaces).length > 0 ? { fontFaces } : {}),
      recipes: { ...recipeDefaults, ...recipes },
      slotRecipes: { ...slotRecipeDefaults, ...slotRecipes },
    }
    return JSON.stringify(theme, null, 2)
  }, [recipes, slotRecipes, tokens])

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
