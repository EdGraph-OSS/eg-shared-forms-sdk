import { useState } from 'react'
import { Box, Button, Flex, Heading, HStack, Input, RadioGroup, Text, VStack } from '@chakra-ui/react'
import { componentGroups, resolveEntryValue } from './recipe-registry'
import type { ComponentGroup, RecipeEntryRef } from './recipe-registry'
import { JsonRecipeEditor } from './JsonRecipeEditor'
import { ComponentPicker } from './ComponentPicker'
import { ComponentPreview } from './ComponentPreview'
import { RecipePicker } from './RecipePicker'
import { ExportPanel } from './ExportPanel'
import { ColorTokensEditor } from './ColorTokensEditor'
import { FontTokensEditor } from './FontTokensEditor'
import { chrome } from './chromeColors'
import type { FontTokenKey, ThemeTokens } from './useThemeEditorState'
import type { ProviderRecipes, ProviderSlotRecipes, RecipesRegistry, SlotRecipesRegistry } from '../ui'

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
}: ThemeEditorPanelProps) {
  const [mode, setMode] = useState<EditorMode>('components')
  const [selectedComponent, setSelectedComponent] = useState<ComponentGroup>(componentGroups[0])
  const [selected, setSelected] = useState<RecipeEntryRef>(componentGroups[0].entries[0])
  const [themeName, setThemeName] = useState('')
  const [themeVersion, setThemeVersion] = useState('')

  const handleSelectComponent = (group: ComponentGroup) => {
    setSelectedComponent(group)
    setSelected(group.entries[0])
  }

  const currentValue = resolveEntryValue(selected, recipes, slotRecipes)

  const handleChange = (parsed: unknown) => {
    if (selected.kind === 'recipe') onRecipeChange(selected.key, parsed)
    else onSlotRecipeChange(selected.key, parsed)
  }

  return (
    <Flex
      flexDir='column'
      borderWidth="1px"
      bg={chrome.editorPanelBg}
      borderColor={chrome.border}
      _dark={{ borderColor: chrome.borderDark }}
      borderRadius="8px"
      mx='auto'
      my='32px'
      boxShadow='0px 0px 5px lightgray'
      p='32px'
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
        <VStack
          key={mode}
          flexDir='column'
          align="stretch"
          gap={3}
          animationName="fade-in, slide-from-bottom"
          animationDuration="0.25s"
          animationTimingFunction="ease-out">
          <Flex flexDir='column' gap='16px' w='350px'>
            <ComponentPicker groups={componentGroups} selected={selectedComponent} onSelect={handleSelectComponent} />
            <RecipePicker entries={selectedComponent.entries} selected={selected} onSelect={setSelected} />
          </Flex>
          <Flex justifyContent='space-between' mt='16px' w='full'>
            <Box borderWidth="1px" borderColor={chrome.border} borderRadius="md" p={4} bg={chrome.panelBg} _dark={{ bg: chrome.panelBgDark, borderColor: chrome.borderDark }} _hover={{ borderColor: chrome.primaryBrand, boxShadow: `0 0 3px ${chrome.primaryBrand}` }} w='49%'>
              <Text fontSize="xs" fontWeight="bold" color={chrome.mutedText} mb={3} textTransform="uppercase">
                {selectedComponent.label} preview
              </Text>
              <ComponentPreview name={selectedComponent.name} />
            </Box>
            <Box borderWidth="1px" borderColor={chrome.border} borderRadius="md" p={4} bg={chrome.panelBg} _dark={{ bg: chrome.panelBgDark, borderColor: chrome.borderDark }} _hover={{ borderColor: chrome.primaryBrand, boxShadow: `0 0 3px ${chrome.primaryBrand}` }} _focusWithin={{ borderColor: chrome.primaryBrand }} w='49%'>
              <Flex alignItems='center' w='full'>
                <Text fontWeight='bold' fontSize="sm" mb='16px' color={chrome.mutedText}>
                  Editing {selected.kind === 'recipe' ? 'recipe' : 'slot recipe'} "{selected.key}"
                </Text>
                <Button
                  bg={chrome.buttonBg}
                  color="white"
                  fontWeight='bold'
                  size="xs"
                  ml='auto'
                  _hover={{ bg: chrome.buttonBgHover }}
                  onClick={() => onResetComponent(selectedComponent.entries)}>Reset {selectedComponent.label} 🔄</Button>
              </Flex>
              <JsonRecipeEditor
                editorKey={`${selected.kind}:${selected.key}`}
                value={currentValue}
                onChange={handleChange} />
            </Box>
          </Flex>
        </VStack>
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
  )
}
