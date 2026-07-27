import { useState } from 'react'
import { Box, Button, Flex, Heading, HStack, Input, RadioGroup, Text } from '@chakra-ui/react'
import type { RecipeEntryRef } from './recipe-registry'
import { ComponentRecipeEditor } from './ComponentRecipeEditor'
import { ExportPanel } from './ExportPanel'
import { ColorTokensEditor } from './ColorTokensEditor'
import { FontTokensEditor } from './FontTokensEditor'
import { chrome } from './chromeColors'
import type { FontTokenKey, ThemeTokens } from './useThemeEditorState'
import type { ProviderRecipes, ProviderSlotRecipes, RecipesRegistry, SlotRecipesRegistry, ThemeConfig } from '../ui'

type EditorMode = 'components' | 'colors' | 'fonts'

const EDITOR_MODES: { value: EditorMode; label: string }[] = [
  { value: 'components', label: 'Widgets / Templates' },
  { value: 'colors', label: 'Colors' },
  { value: 'fonts', label: 'Fonts' },
]

interface ThemeEditorPanelProps {
  recipes: ProviderRecipes
  slotRecipes: ProviderSlotRecipes
  tokens: ThemeTokens
  onRecipeChange: (key: keyof RecipesRegistry, value: unknown) => void
  onSlotRecipeChange: (key: keyof SlotRecipesRegistry, value: unknown) => void
  onColorTokenChange: (scale: string, shade: string, value: string) => void
  onColorTokenRemove: (scale: string, shade: string) => void
  onFontTokenChange: (key: FontTokenKey, value: string, href?: string) => void
  onReset: () => void
  onResetColors: () => void
  onResetComponent: (entries: RecipeEntryRef[]) => void
  onLoadTheme: (theme: ThemeConfig) => void
}

export function ThemeEditorPanel({
  recipes,
  slotRecipes,
  tokens,
  onRecipeChange,
  onSlotRecipeChange,
  onColorTokenChange,
  onColorTokenRemove,
  onFontTokenChange,
  onReset,
  onResetColors,
  onResetComponent,
  onLoadTheme,
}: ThemeEditorPanelProps) {
  const [mode, setMode] = useState<EditorMode>('components')
  const [themeName, setThemeName] = useState('')
  const [themeVersion, setThemeVersion] = useState('')

  const handleLoadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        onLoadTheme(parsed)
        if (typeof parsed?.meta?.name === 'string') setThemeName(parsed.meta.name)
        if (typeof parsed?.meta?.version === 'string') setThemeVersion(parsed.meta.version)
      } catch {
        // Ignore malformed/non-JSON files — the editor state is left untouched.
      }
    }
    reader.readAsText(file)
  }

  return (
    <Flex
      flexDir='column'
      mx='auto'
      my='32px'
      w='80%'>
      <HStack justify="space-between" mb={4}>
        <Heading
          fontFamily='heading'
          color={chrome.text}
          size="3xl"
          _dark={{ color: chrome.textDark }}>Theme Editor</Heading>
          <Button
            fontWeight='bold'
            color="white"
            bg={chrome.buttonBg}
            _hover={{ bg: chrome.buttonBgHover }}
            size="sm"
            onClick={onReset}>Reset to defaults 🔄</Button>
      </HStack>
      <Flex
        flexDir='column'
        borderWidth="1px"
        bg={chrome.editorPanelBg}
        borderColor={chrome.border}
        _dark={{ borderColor: chrome.borderDark }}
        borderRadius="8px"
        boxShadow='0px 0px 5px lightgray'
        p='32px'
        w='full'>
        <HStack gap={4} mb={4}>
          <Box>
            <Text fontSize="16px" fontWeight="bold" mb={1}>
              Theme name
            </Text>
            <Input
              size="sm"
              w="220px"
              borderColor={chrome.border}
              bg={chrome.fieldBg}
              color={chrome.text}
              _hover={{ borderColor: chrome.primaryBrand, boxShadow: `0 0 3px ${chrome.primaryBrand}` }}
              _focusVisible={{ borderColor: chrome.primaryBrand, boxShadow: `0 0 0 1px ${chrome.primaryBrand}` }}
              placeholder="e.g. My Custom Theme"
              value={themeName}
              onChange={e => setThemeName(e.target.value)} />
          </Box>
          <Box>
            <Text fontSize="16px" fontWeight="bold" mb={1}>
              Version
            </Text>
            <Input
              size="sm"
              w="100px"
              borderColor={chrome.border}
              bg={chrome.fieldBg}
              color={chrome.text}
              _hover={{ borderColor: chrome.primaryBrand, boxShadow: `0 0 3px ${chrome.primaryBrand}` }}
              _focusVisible={{ borderColor: chrome.primaryBrand, boxShadow: `0 0 0 1px ${chrome.primaryBrand}` }}
              placeholder="e.g. 1"
              inputMode="numeric"
              value={themeVersion}
              onChange={e => setThemeVersion(e.target.value.replace(/\D/g, ''))} />
          </Box>
          <Box>
            <Text fontSize="16px" fontWeight="bold" mb={1}>
              Load theme
            </Text>
            <Input
              size="sm"
              w="220px"
              p="4px"
              borderColor={chrome.border}
              bg={chrome.fieldBg}
              color={chrome.text}
              _hover={{ borderColor: chrome.primaryBrand, boxShadow: `0 0 3px ${chrome.primaryBrand}` }}
              _focusVisible={{ borderColor: chrome.primaryBrand, boxShadow: `0 0 0 1px ${chrome.primaryBrand}` }}
              type="file"
              accept="application/json"
              onChange={handleLoadFile} />
          </Box>
        </HStack>
        <Text fontWeight='bold'>Select Mode</Text>
        <RadioGroup.Root
          colorPalette='orange'
          value={mode}
          mt='8px'
          onValueChange={e => setMode(e.value as EditorMode)}
          mb={4}>
          <HStack gap={5}>
            {EDITOR_MODES.map(item => (
              <RadioGroup.Item key={item.value} value={item.value}>
                <RadioGroup.ItemHiddenInput />
                <RadioGroup.ItemIndicator />
                <RadioGroup.ItemText color={chrome.text} fontWeight='bold' _dark={{ color: chrome.textDark }}>
                  {item.label}
                </RadioGroup.ItemText>
              </RadioGroup.Item>
            ))}
          </HStack>
        </RadioGroup.Root>
        {mode === 'components' && (
          <ComponentRecipeEditor
            key={mode}
            recipes={recipes}
            slotRecipes={slotRecipes}
            onRecipeChange={onRecipeChange}
            onSlotRecipeChange={onSlotRecipeChange}
            onResetComponent={onResetComponent} />
        )}
        {mode === 'colors' && (
          <Box
            key={mode}
            borderWidth="1px"
            borderColor={chrome.border}
            borderRadius="md"
            p={4}
            bg={chrome.panelBg}
            _dark={{ bg: chrome.panelBgDark, borderColor: chrome.borderDark }}
            animationName="fade-in, slide-from-bottom"
            animationDuration="0.25s"
            animationTimingFunction="ease-out">
            <ColorTokensEditor tokens={tokens} onChange={onColorTokenChange} onRemove={onColorTokenRemove} onReset={onResetColors} />
          </Box>
        )}
        {mode === 'fonts' && (
          <Box
            key={mode}
            borderWidth="1px"
            borderColor={chrome.border}
            borderRadius="md"
            p={4}
            bg={chrome.panelBg}
            _dark={{ bg: chrome.panelBgDark, borderColor: chrome.borderDark }}
            animationName="fade-in, slide-from-bottom"
            animationDuration="0.25s"
            animationTimingFunction="ease-out">
            <FontTokensEditor tokens={tokens} onChange={onFontTokenChange} />
          </Box>
        )}
        <Box mt={6}>
          <ExportPanel recipes={recipes} slotRecipes={slotRecipes} tokens={tokens} themeName={themeName} themeVersion={themeVersion} />
        </Box>
      </Flex>
    </Flex>
  )
}
