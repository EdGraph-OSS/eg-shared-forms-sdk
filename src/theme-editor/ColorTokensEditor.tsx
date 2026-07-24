import { useState } from 'react'
import { Box, Button, Flex, Grid, HStack, Input, Text, VStack } from '@chakra-ui/react'
import { colors } from '../ui'
import { chrome } from './chromeColors'
import type { ThemeTokens } from './useThemeEditorState'
import ColorTokenPicker from './ColorTokenPicker'

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

interface ColorTokensEditorProps {
  tokens: ThemeTokens
  onChange: (scale: string, shade: string, value: string) => void
  onRemove: (scale: string, shade: string) => void
  onReset: () => void
}

function resolveValue(tokens: ThemeTokens, scale: string, shade: string): string {
  const override = (tokens.colors?.[scale] as Record<string, { value: string }> | undefined)?.[shade]
  if (override) return override.value
  return (colors as Record<string, Record<string, string>>)[scale][shade]
}

interface CustomEntry {
  scale: string
  shade: string
  value: string
}

function getCustomEntries(tokens: ThemeTokens): CustomEntry[] {
  const overrides = tokens.colors as Record<string, Record<string, { value: string }>> | undefined
  if (!overrides) return []
  const base = colors as Record<string, Record<string, string>>
  const entries: CustomEntry[] = []
  for (const [scale, shades] of Object.entries(overrides)) {
    for (const [shade, token] of Object.entries(shades)) {
      const isCustom = !base[scale] || !(shade in base[scale])
      if (isCustom) entries.push({ scale, shade, value: token.value })
    }
  }
  return entries
}

export function ColorTokensEditor({ tokens, onChange, onRemove, onReset }: ColorTokensEditorProps) {
  const [newScale, setNewScale] = useState('')
  const [newShade, setNewShade] = useState('')
  const [newValue, setNewValue] = useState('#000000')

  const customEntries = getCustomEntries(tokens)
  const customByScale = customEntries.reduce<Record<string, CustomEntry[]>>((acc, entry) => {
    (acc[entry.scale] ??= []).push(entry)
    return acc
  }, {})
  const baseScales = colors as Record<string, Record<string, string>>
  const customOnlyScales = Object.keys(customByScale).filter(scale => !baseScales[scale])
  const canAdd = newScale.trim().length > 0 && newShade.trim().length > 0

  const handleAdd = () => {
    if (!canAdd) return
    onChange(newScale.trim(), newShade.trim(), newValue)
    setNewScale('')
    setNewShade('')
    setNewValue('#000000')
  }

  return (
    <>
      <HStack justify="space-between" mb={2}>
        <Text fontSize="xs" fontWeight="bold" color={chrome.mutedText} textTransform="uppercase">
          Add color entry
        </Text>
        <Button
          fontWeight='bold'
          border='1px solid black'
          color={chrome.text}
          bg="transparent"
          _hover={{ bg: chrome.border }}
          size="xs"
          onClick={onReset}>Reset colors 🔄</Button>
      </HStack>
      <HStack gap={2}>
        <input
          type="color"
          value={HEX_RE.test(newValue) ? newValue : '#000000'}
          onChange={e => setNewValue(e.target.value)}
          style={{ width: 40, height: 40, padding: 0, border: 'none', background: 'none', flexShrink: 0 }}
        />
        <Input size="sm" borderColor={chrome.border} bg={chrome.fieldBg} color={chrome.text} placeholder="scale (e.g. blue)" value={newScale} onChange={e => setNewScale(e.target.value)} />
        <Input size="sm" borderColor={chrome.border} bg={chrome.fieldBg} color={chrome.text} placeholder="shade (e.g. 1000)" value={newShade} onChange={e => setNewShade(e.target.value)} />
        <Button size="sm" bg={chrome.buttonBg} color="white" _hover={{ bg: chrome.buttonBgHover }} onClick={handleAdd} disabled={!canAdd}>Add</Button>
      </HStack>
      <VStack align="stretch" mt='16px' gap={5}>
        {Object.entries(colors).map(([scale, shades]) => (
          <Box key={scale} borderWidth="1px" borderColor={chrome.border} borderRadius="md" p={3}>
            <Text fontWeight="bold" fontSize="sm" mb={2} textTransform="capitalize" color={chrome.text}>{scale}</Text>
            <Grid templateColumns="repeat(auto-fill, 80px)" alignItems='center' gap={3}>
              {Object.keys(shades).map(shade => {
                const value = resolveValue(tokens, scale, shade)
                const swatch = HEX_RE.test(value) ? value : '#000000'
                return (
                  <Flex key={shade} position='relative' alignItems='center' h='40px' gap={2}>
                    <ColorTokenPicker
                      swatch={swatch}
                      scale={scale}
                      shade={shade}
                      onChange={onChange} />
                    <Text fontSize="xs" color={chrome.mutedText}>{shade}</Text>
                  </Flex>
                )
              })}
              {(customByScale[scale] ?? []).map(({ shade, value }) => {
                const swatch = HEX_RE.test(value) ? value : '#000000'
                return (
                  <Flex key={shade} position='relative' alignItems='center' h='40px' gap={2}>
                    <ColorTokenPicker
                      swatch={swatch}
                      scale={scale}
                      shade={shade}
                      onChange={onChange} />
                    <Text fontSize="xs" color={chrome.mutedText} flex={1}>{shade}</Text>
                    <Button
                      bg='white'
                      color='red'
                      border='1px solid red'
                      padding='0px'
                      top='-15px'
                      right='-6px'
                      height='20px'
                      px='6px'
                      position='absolute'
                      onClick={() => onRemove(scale, shade)}>Delete</Button>
                  </Flex>
                )
              })}
            </Grid>
          </Box>
        ))}

        {customOnlyScales.map(scale => (
          <Box key={scale} borderWidth="1px" borderColor={chrome.border} borderRadius="md" p={3}>
            <Text fontWeight="bold" fontSize="sm" mb={2} textTransform="capitalize" color={chrome.text}>{scale}</Text>
            <Grid templateColumns="repeat(auto-fill, 160px)" alignItems='center' gap={3}>
              {customByScale[scale].map(({ shade, value }) => {
                const swatch = HEX_RE.test(value) ? value : '#000000'
                return (
                  <Flex key={shade} alignItems='center' h='40px' gap={2}>
                    <ColorTokenPicker
                      swatch={swatch}
                      scale={scale}
                      shade={shade}
                      onChange={onChange} />
                    <Text fontSize="xs" color={chrome.mutedText} flex={1}>{shade}</Text>
                    <Button size="xs" color={chrome.text} bg="transparent" border="1px solid black" _hover={{ bg: chrome.border }} onClick={() => onRemove(scale, shade)}>Remove</Button>
                  </Flex>
                )
              })}
            </Grid>
          </Box>
        ))}
      </VStack>
    </>
  )
}
