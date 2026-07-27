import { useState } from 'react'
import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react'
import { componentGroups, resolveEntryValue } from './recipe-registry'
import type { ComponentGroup, RecipeEntryRef } from './recipe-registry'
import { JsonRecipeEditor } from './JsonRecipeEditor'
import { ComponentPicker } from './ComponentPicker'
import { ComponentPreview } from './ComponentPreview'
import { RecipePicker } from './RecipePicker'
import { chrome } from './chromeColors'
import type { ProviderRecipes, ProviderSlotRecipes, RecipesRegistry, SlotRecipesRegistry } from '../ui'

interface ComponentRecipeEditorProps {
  recipes: ProviderRecipes
  slotRecipes: ProviderSlotRecipes
  onRecipeChange: (key: keyof RecipesRegistry, value: unknown) => void
  onSlotRecipeChange: (key: keyof SlotRecipesRegistry, value: unknown) => void
  onResetComponent: (entries: RecipeEntryRef[]) => void
  /** Restricts the component picker to a subset of `componentGroups` — e.g. widgets only. Defaults to all groups. */
  groups?: ComponentGroup[]
}

/** Component picker + recipe picker + live preview + JSON editor grid, shared by `ThemeEditorPanel`'s "Widgets / Templates" mode and the standalone `ComponentStylesPanel`. */
export function ComponentRecipeEditor({
  recipes,
  slotRecipes,
  onRecipeChange,
  onSlotRecipeChange,
  onResetComponent,
  groups = componentGroups,
}: ComponentRecipeEditorProps) {
  const [selectedComponent, setSelectedComponent] = useState<ComponentGroup>(groups[0])
  const [selected, setSelected] = useState<RecipeEntryRef>(groups[0].entries[0])

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
    <VStack
      flexDir='column'
      align="stretch"
      gap={3}
      animationName="fade-in, slide-from-bottom"
      animationDuration="0.25s"
      animationTimingFunction="ease-out">
      <Flex flexDir='column' gap='16px' w='350px'>
        <ComponentPicker groups={groups} selected={selectedComponent} onSelect={handleSelectComponent} />
        <RecipePicker entries={selectedComponent.entries} selected={selected} onSelect={setSelected} />
      </Flex>
      <Flex justifyContent='space-between' mt='16px' w='full'>
        <Flex flexDir='column' w='49%'>
          <Flex w='full' alignItems='center' h='32px' mb={2}>
            <Text fontSize="md" fontWeight="bold" color={chrome.text} _dark={{ color: chrome.textDark }}>
              {selectedComponent.label} preview
            </Text>
          </Flex>
          <Box borderWidth="1px" borderColor={chrome.border} borderRadius="md" p={4} bg={chrome.panelBg} _dark={{ bg: chrome.panelBgDark, borderColor: chrome.borderDark }} _hover={{ borderColor: chrome.primaryBrand, boxShadow: `0 0 3px ${chrome.primaryBrand}` }} w='full'>
            <ComponentPreview name={selectedComponent.name} />
          </Box>
        </Flex>
        <Flex flexDir='column' w='49%'>
          <Flex w='full' alignItems='center' h='32px' mb={2}>
            <Text fontWeight='bold' fontSize="md" color={chrome.text} _dark={{ color: chrome.textDark }}>
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
          <Box borderWidth="1px" borderColor={chrome.border} borderRadius="md" p={4} bg={chrome.panelBg} _dark={{ bg: chrome.panelBgDark, borderColor: chrome.borderDark }} _hover={{ borderColor: chrome.primaryBrand, boxShadow: `0 0 3px ${chrome.primaryBrand}` }} _focusWithin={{ borderColor: chrome.primaryBrand }} w='full'>
            <JsonRecipeEditor
              editorKey={`${selected.kind}:${selected.key}`}
              value={currentValue}
              onChange={handleChange} />
          </Box>
        </Flex>
      </Flex>
    </VStack>
  )
}
