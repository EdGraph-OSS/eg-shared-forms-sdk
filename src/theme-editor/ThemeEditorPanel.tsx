import { useState } from 'react'
import { Box, Button, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { componentGroups, resolveEntryValue } from './recipe-registry'
import type { ComponentGroup, RecipeEntryRef } from './recipe-registry'
import { JsonRecipeEditor } from './JsonRecipeEditor'
import { ComponentPicker } from './ComponentPicker'
import { ComponentPreview } from './ComponentPreview'
import { RecipePicker } from './RecipePicker'
import { ExportPanel } from './ExportPanel'
import type { ProviderRecipes, ProviderSlotRecipes, RecipesRegistry, SlotRecipesRegistry } from '../ui'

interface ThemeEditorPanelProps {
  recipes: ProviderRecipes
  slotRecipes: ProviderSlotRecipes
  onRecipeChange: (key: keyof RecipesRegistry, value: unknown) => void
  onSlotRecipeChange: (key: keyof SlotRecipesRegistry, value: unknown) => void
  onReset: () => void
  onResetComponent: (entries: RecipeEntryRef[]) => void
}

export function ThemeEditorPanel({
  recipes,
  slotRecipes,
  onRecipeChange,
  onSlotRecipeChange,
  onReset,
  onResetComponent,
}: ThemeEditorPanelProps) {
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
    <Flex flexDir='column' borderWidth="1px" borderRadius="md" p={4} w='full'>
      <HStack justify="space-between" mb={4}>
        <Heading size="xl">Theme Editor</Heading>
          <Button
            fontWeight='bold'
            border='1px solid black'
            size="sm"
            variant="outline"
            onClick={onReset}>Reset to defaults 🔄</Button>
      </HStack>
      <VStack flexDir='column' align="stretch" gap={3}>
        <Flex flexDir='column' gap='16px' w='350px'>
          <ComponentPicker groups={componentGroups} selected={selectedComponent} onSelect={handleSelectComponent} />
          <RecipePicker entries={selectedComponent.entries} selected={selected} onSelect={setSelected} />
        </Flex>
        <Flex justifyContent='space-between' mt='16px' w='full'>
          <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.50" _dark={{ bg: 'gray.900' }} w='49%'>
            <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={3} textTransform="uppercase">
              {selectedComponent.label} preview
            </Text>
            <ComponentPreview name={selectedComponent.name} />
          </Box>
          <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.50" _dark={{ bg: 'gray.900' }} w='49%'>
            <Flex alignItems='center' w='full'>
              <Text fontWeight='bold' fontSize="sm" my='16px' color="gray.500">
                Editing {selected.kind === 'recipe' ? 'recipe' : 'slot recipe'} "{selected.key}" — changes apply live to the preview above.
              </Text>
              <Button
                bg='white'
                fontWeight='bold'
                border='1px solid black'
                size="xs"
                ml='auto'
                variant="outline"
                onClick={() => onResetComponent(selectedComponent.entries)}>Reset {selectedComponent.label} 🔄</Button>
            </Flex>
            <JsonRecipeEditor
              editorKey={`${selected.kind}:${selected.key}`}
              value={currentValue}
              onChange={handleChange} />
          </Box>
        </Flex>
      </VStack>
      <Box mt={6}>
        <ExportPanel recipes={recipes} slotRecipes={slotRecipes} />
      </Box>
    </Flex>
  )
}
