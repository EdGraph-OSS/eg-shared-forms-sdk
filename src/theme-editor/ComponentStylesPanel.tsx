import { useState } from 'react'
import { Box, Button, Collapsible, Flex, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import { componentOptionsSeeds, customStylesSeeds, widgetComponentGroups } from './recipe-registry'
import type { ComponentGroup } from './recipe-registry'
import { ComponentPicker } from './ComponentPicker'
import { ComponentPreview } from './ComponentPreview'
import { JsonRecipeEditor } from './JsonRecipeEditor'
import { chrome } from './chromeColors'

const INITIAL_WIDGET = widgetComponentGroups[0]

/** The starting-point example styles for a widget, or `{}` if it has none. */
function seedStylesFor(name: string): Record<string, unknown> {
  return customStylesSeeds[name] ?? {}
}

/** The starting-point example non-style `component` properties for a widget, or `{}` if it has none. */
function seedOptionsFor(name: string): Record<string, unknown> {
  return componentOptionsSeeds[name] ?? {}
}

interface JsonEditorCardProps {
  label: string
  value: unknown
  editorKey: string
  onChange: (parsed: unknown) => void
  onReset: () => void
  copied: boolean
  onCopy: () => void
  open: boolean
  onToggleOpen: () => void
  w?: string
}

/** A titled JSON editor card with Copy/Reset/Collapse actions — shared shape for the styles and options editors below. Its editor body collapses independently of any other card via its own `open` state. */
function JsonEditorCard({ label, value, editorKey, onChange, onReset, copied, onCopy, open, onToggleOpen, w = '49%' }: JsonEditorCardProps) {
  return (
    <Flex flexDir='column' w={w}>
      <Flex alignItems='center' w='full' gap={2} mb={2}>
        <Text fontWeight='bold' fontSize="md" color={chrome.text} _dark={{ color: chrome.textDark }}>
          {label}
        </Text>
        <HStack ml='auto' gap={2}>
          <Button
            bg={chrome.buttonBg}
            color="white"
            fontWeight='bold'
            size="xs"
            _hover={{ bg: chrome.buttonBgHover }}
            onClick={onCopy}>{copied ? 'Copied! ✅' : 'Copy 📋'}</Button>
          <Button
            bg={chrome.buttonBg}
            color="white"
            fontWeight='bold'
            size="xs"
            _hover={{ bg: chrome.buttonBgHover }}
            onClick={onReset}>Reset 🔄</Button>
          <Button
            bg={chrome.buttonBg}
            color="white"
            fontWeight='bold'
            size="xs"
            _hover={{ bg: chrome.buttonBgHover }}
            onClick={onToggleOpen}>{open ? 'Hide ▲' : 'Show ▼'}</Button>
        </HStack>
      </Flex>
      <Box borderWidth="1px" borderColor={chrome.border} borderRadius="md" p={4} bg={chrome.panelBg} _dark={{ bg: chrome.panelBgDark, borderColor: chrome.borderDark }} _hover={{ borderColor: chrome.primaryBrand, boxShadow: `0 0 3px ${chrome.primaryBrand}` }} _focusWithin={{ borderColor: chrome.primaryBrand }} w='full'>
        <Collapsible.Root open={open}>
          <Collapsible.Content>
            <JsonRecipeEditor
              editorKey={editorKey}
              value={value}
              onChange={onChange} />
          </Collapsible.Content>
        </Collapsible.Root>
      </Box>
    </Flex>
  )
}

/**
 * Same chrome as `ThemeEditorPanel`, but scoped to the per-instance `customStyles`/other `component`
 * properties a handful of widgets accept via `ui:options`/`options` — not the global recipes/
 * slotRecipes `ThemeEditorPanel` already covers. Edits here are local to this panel (not persisted/
 * exported) and only exist to preview what those overrides look like on a given widget.
 */
export function ComponentStylesPanel() {
  const [selected, setSelected] = useState<ComponentGroup>(INITIAL_WIDGET)
  // Only holds user edits; a widget with no entry here falls back to its seed example (see
  // `currentStyles`/`currentOptions`) — that's what makes "Reset" restore the placeholder rather
  // than blanking it.
  const [customStylesByWidget, setCustomStylesByWidget] = useState<Record<string, unknown>>({})
  const [optionsByWidget, setOptionsByWidget] = useState<Record<string, unknown>>({})
  // Bumped on every reset so the editors (keyed off it) discard their in-progress text and
  // re-seed from the now-cleared value, rather than keeping stale unsaved edits on screen.
  const [resetNonce, setResetNonce] = useState(0)
  const [copiedStyles, setCopiedStyles] = useState(false)
  const [copiedOptions, setCopiedOptions] = useState(false)
  // Independent per-panel collapse state — hiding one editor's body never affects the other's.
  const [stylesOpen, setStylesOpen] = useState(true)
  const [optionsOpen, setOptionsOpen] = useState(true)

  const currentStyles = customStylesByWidget[selected.name] ?? seedStylesFor(selected.name)
  const currentOptions = optionsByWidget[selected.name] ?? seedOptionsFor(selected.name)

  const handleSelect = (group: ComponentGroup) => {
    setSelected(group)
    setCopiedStyles(false)
    setCopiedOptions(false)
  }

  const handleStylesChange = (parsed: unknown) => {
    setCustomStylesByWidget(prev => ({ ...prev, [selected.name]: parsed }))
  }

  const handleOptionsChange = (parsed: unknown) => {
    setOptionsByWidget(prev => ({ ...prev, [selected.name]: parsed }))
  }

  const handleResetStyles = () => {
    setCustomStylesByWidget((prev) => {
      const { [selected.name]: _removed, ...rest } = prev
      return rest
    })
    setResetNonce(n => n + 1)
    setCopiedStyles(false)
  }

  const handleResetOptions = () => {
    setOptionsByWidget((prev) => {
      const { [selected.name]: _removed, ...rest } = prev
      return rest
    })
    setResetNonce(n => n + 1)
    setCopiedOptions(false)
  }

  const handleResetAll = () => {
    setCustomStylesByWidget({})
    setOptionsByWidget({})
    setResetNonce(n => n + 1)
    setCopiedStyles(false)
    setCopiedOptions(false)
  }

  const handleCopyStyles = async () => {
    await navigator.clipboard.writeText(JSON.stringify(currentStyles, null, 2))
    setCopiedStyles(true)
    setTimeout(() => setCopiedStyles(false), 1500)
  }

  const handleCopyOptions = async () => {
    await navigator.clipboard.writeText(JSON.stringify(currentOptions, null, 2))
    setCopiedOptions(true)
    setTimeout(() => setCopiedOptions(false), 1500)
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
          _dark={{ color: chrome.textDark }}>Widget Styles</Heading>
        <Button
          fontWeight='bold'
          color="white"
          bg={chrome.buttonBg}
          _hover={{ bg: chrome.buttonBgHover }}
          size="sm"
          onClick={handleResetAll}>Reset all 🔄</Button>
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
        <VStack
          flexDir='column'
          align="stretch"
          gap={3}
          animationName="fade-in, slide-from-bottom"
          animationDuration="0.25s"
          animationTimingFunction="ease-out">
          <Box w='350px'>
            <ComponentPicker groups={widgetComponentGroups} selected={selected} onSelect={handleSelect} />
          </Box>
          <Box mt='16px' w='full'>
            <Text fontSize="md" fontWeight="bold" color={chrome.text} _dark={{ color: chrome.textDark }} mb={2}>
              {selected.label} preview
            </Text>
            <Box borderWidth="1px" borderColor={chrome.border} borderRadius="md" p={4} bg={chrome.panelBg} _dark={{ bg: chrome.panelBgDark, borderColor: chrome.borderDark }} _hover={{ borderColor: chrome.primaryBrand, boxShadow: `0 0 3px ${chrome.primaryBrand}` }} w='full'>
              <ComponentPreview
                name={selected.name}
                customStyles={currentStyles as Record<string, unknown>}
                options={currentOptions as Record<string, unknown>} />
            </Box>
          </Box>
          <Flex justifyContent='space-between' gap={4} mt='16px' w='full'>
            <JsonEditorCard
              label={`Editing custom styles for "${selected.label}"`}
              value={currentStyles}
              editorKey={`styles:${selected.name}:${resetNonce}`}
              onChange={handleStylesChange}
              onReset={handleResetStyles}
              copied={copiedStyles}
              onCopy={handleCopyStyles}
              open={stylesOpen}
              onToggleOpen={() => setStylesOpen(o => !o)} />
            <JsonEditorCard
              label={`Editing other options for "${selected.label}"`}
              value={currentOptions}
              editorKey={`options:${selected.name}:${resetNonce}`}
              onChange={handleOptionsChange}
              onReset={handleResetOptions}
              copied={copiedOptions}
              onCopy={handleCopyOptions}
              open={optionsOpen}
              onToggleOpen={() => setOptionsOpen(o => !o)} />
          </Flex>
        </VStack>
      </Flex>
    </Flex>
  )
}
