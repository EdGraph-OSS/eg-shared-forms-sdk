import { Box, Input, Text, VStack } from '@chakra-ui/react'
import { fonts } from '../ui/theme'
import { chrome } from './chromeColors'
import type { FontTokenKey, ThemeTokens } from './useThemeEditorState'

const FONT_KEYS: FontTokenKey[] = ['heading', 'body', 'mono']

interface FontTokensEditorProps {
  tokens: ThemeTokens
  onChange: (key: FontTokenKey, value: string) => void
}

function resolveValue(tokens: ThemeTokens, key: FontTokenKey): string {
  return (tokens.fonts?.[key] as { value: string } | undefined)?.value ?? fonts[key]
}

export function FontTokensEditor({ tokens, onChange }: FontTokensEditorProps) {
  return (
    <VStack align="stretch" gap={5}>
      {FONT_KEYS.map(key => {
        const value = resolveValue(tokens, key)
        return (
          <Box key={key} borderWidth="1px" borderColor={chrome.border} borderRadius="md" p={3}>
            <Text fontWeight="bold" fontSize="sm" mb={2} textTransform="capitalize" color={chrome.text}>{key}</Text>
            <Input
              size="sm"
              fontFamily="mono"
              borderColor={chrome.border}
              bg={chrome.fieldBg}
              color={chrome.text}
              value={value}
              onChange={e => onChange(key, e.target.value)}
              mb={3}
            />
            <Text fontSize="lg" color={chrome.text} style={{ fontFamily: value }}>
              The quick brown fox jumps over the lazy dog
            </Text>
          </Box>
        )
      })}
    </VStack>
  )
}
