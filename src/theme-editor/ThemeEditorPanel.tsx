import { useState } from 'react'
import { Box, Button, Flex, Heading, HStack, RadioGroup, Text, VStack } from '@chakra-ui/react'
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
  onFontTokenChange: (key: FontTokenKey, value: string) => void
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
      borderColor={chrome.border}
      _dark={{ borderColor: chrome.borderDark }}
      borderRadius="md"
      p={4}
      w='full'
    >
      <HStack justify="space-between" mb={4}>
        <Heading size="xl" color={chrome.text} _dark={{ color: chrome.textDark }}>Theme Editor</Heading>
          <Button
            fontWeight='bold'
            border='1px solid black'
            color={chrome.text}
            bg="transparent"
            _hover={{ bg: chrome.border }}
            _dark={{ color: chrome.textDark, _hover: { bg: chrome.borderDark } }}
            size="sm"
            onClick={onReset}>Reset to defaults 🔄</Button>
      </HStack>
      <Text fontWeight='bold'>Select Mode</Text>
      <RadioGroup.Root
        colorPalette="blackAlpha"
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
        <VStack flexDir='column' align="stretch" gap={3}>
          <Flex flexDir='column' gap='16px' w='350px'>
            <ComponentPicker groups={componentGroups} selected={selectedComponent} onSelect={handleSelectComponent} />
            <RecipePicker entries={selectedComponent.entries} selected={selected} onSelect={setSelected} />
          </Flex>
          <Flex justifyContent='space-between' mt='16px' w='full'>
            <Box borderWidth="1px" borderColor={chrome.border} borderRadius="md" p={4} bg={chrome.panelBg} _dark={{ bg: chrome.panelBgDark, borderColor: chrome.borderDark }} w='49%'>
              <Text fontSize="xs" fontWeight="bold" color={chrome.mutedText} mb={3} textTransform="uppercase">
                {selectedComponent.label} preview
              </Text>
              <ComponentPreview name={selectedComponent.name} />
            </Box>
            <Box borderWidth="1px" borderColor={chrome.border} borderRadius="md" p={4} bg={chrome.panelBg} _dark={{ bg: chrome.panelBgDark, borderColor: chrome.borderDark }} w='49%'>
              <Flex alignItems='center' w='full'>
                <Text fontWeight='bold' fontSize="sm" my='16px' color={chrome.mutedText}>
                  Editing {selected.kind === 'recipe' ? 'recipe' : 'slot recipe'} "{selected.key}" — changes apply live to the preview above.
                </Text>
                <Button
                  bg='white'
                  color={chrome.text}
                  fontWeight='bold'
                  border='1px solid black'
                  size="xs"
                  ml='auto'
                  _hover={{ bg: chrome.border }}
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
        <Box borderWidth="1px" borderColor={chrome.border} borderRadius="md" p={4} bg={chrome.panelBg} _dark={{ bg: chrome.panelBgDark, borderColor: chrome.borderDark }}>
          <ColorTokensEditor tokens={tokens} onChange={onColorTokenChange} onRemove={onColorTokenRemove} onReset={onResetColors} />
        </Box>
      )}
      {mode === 'fonts' && (
        <Box borderWidth="1px" borderColor={chrome.border} borderRadius="md" p={4} bg={chrome.panelBg} _dark={{ bg: chrome.panelBgDark, borderColor: chrome.borderDark }}>
          <FontTokensEditor tokens={tokens} onChange={onFontTokenChange} />
        </Box>
      )}
      <Box mt={6}>
        <ExportPanel recipes={recipes} slotRecipes={slotRecipes} tokens={tokens} />
      </Box>
    </Flex>
  )
}
