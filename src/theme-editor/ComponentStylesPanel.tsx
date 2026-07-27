import { useState } from 'react'
import { Box, Button, Flex, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import { widgetComponentGroups } from './recipe-registry'
import type { ComponentGroup } from './recipe-registry'
import { ComponentPicker } from './ComponentPicker'
import { ComponentPreview } from './ComponentPreview'
import { JsonRecipeEditor } from './JsonRecipeEditor'
import { chrome } from './chromeColors'

/**
 * Same chrome as `ThemeEditorPanel`, but scoped to the per-instance `customStyles` a handful of
 * widgets accept via `ui:options`/`options` — not the global recipes/slotRecipes `ThemeEditorPanel`
 * already covers. Styles here are local to this panel (not persisted/exported) and only exist to
 * preview what a `customStyles` override looks like on a given widget.
 */
export function ComponentStylesPanel() {
  const [selected, setSelected] = useState<ComponentGroup>(widgetComponentGroups[0])
  const [customStylesByWidget, setCustomStylesByWidget] = useState<Record<string, unknown>>({})

  const currentStyles = customStylesByWidget[selected.name] ?? {}

  const handleChange = (parsed: unknown) => {
    setCustomStylesByWidget(prev => ({ ...prev, [selected.name]: parsed }))
  }

  const handleResetSelected = () => {
    setCustomStylesByWidget((prev) => {
      const { [selected.name]: _removed, ...rest } = prev
      return rest
    })
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
          _dark={{ color: chrome.textDark }}>Widget Styles</Heading>
        <Button
          fontWeight='bold'
          color="white"
          bg={chrome.buttonBg}
          _hover={{ bg: chrome.buttonBgHover }}
          size="sm"
          onClick={() => setCustomStylesByWidget({})}>Reset all 🔄</Button>
      </HStack>
      <VStack
        flexDir='column'
        align="stretch"
        gap={3}
        animationName="fade-in, slide-from-bottom"
        animationDuration="0.25s"
        animationTimingFunction="ease-out">
        <Box w='350px'>
          <ComponentPicker groups={widgetComponentGroups} selected={selected} onSelect={setSelected} />
        </Box>
        <Flex justifyContent='space-between' mt='16px' w='full'>
          <Box borderWidth="1px" borderColor={chrome.border} borderRadius="md" p={4} bg={chrome.panelBg} _dark={{ bg: chrome.panelBgDark, borderColor: chrome.borderDark }} _hover={{ borderColor: chrome.primaryBrand, boxShadow: `0 0 3px ${chrome.primaryBrand}` }} w='49%'>
            <Text fontSize="xs" fontWeight="bold" color={chrome.mutedText} mb={3} textTransform="uppercase">
              {selected.label} preview
            </Text>
            <ComponentPreview name={selected.name} customStyles={currentStyles as Record<string, unknown>} />
          </Box>
          <Box borderWidth="1px" borderColor={chrome.border} borderRadius="md" p={4} bg={chrome.panelBg} _dark={{ bg: chrome.panelBgDark, borderColor: chrome.borderDark }} _hover={{ borderColor: chrome.primaryBrand, boxShadow: `0 0 3px ${chrome.primaryBrand}` }} _focusWithin={{ borderColor: chrome.primaryBrand }} w='49%'>
            <Flex alignItems='center' w='full'>
              <Text fontWeight='bold' fontSize="sm" mb='16px' color={chrome.mutedText}>
                Editing custom styles for "{selected.label}"
              </Text>
              <Button
                bg={chrome.buttonBg}
                color="white"
                fontWeight='bold'
                size="xs"
                ml='auto'
                _hover={{ bg: chrome.buttonBgHover }}
                onClick={handleResetSelected}>Reset {selected.label} 🔄</Button>
            </Flex>
            <JsonRecipeEditor
              editorKey={selected.name}
              value={currentStyles}
              onChange={handleChange} />
          </Box>
        </Flex>
      </VStack>
    </Flex>
  )
}
