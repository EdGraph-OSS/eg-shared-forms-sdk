import { Box, Input, NativeSelect, Text, VStack } from '@chakra-ui/react'
import { fonts } from '../ui/theme'
import { chrome } from './chromeColors'
import { FONT_FALLBACKS, GOOGLE_FONT_OPTIONS, buildFontFamilyValue, buildGoogleFontsHref, parseGoogleFontFamily } from './googleFonts'
import type { FontTokenKey, ThemeTokens } from './useThemeEditorState'

const FONT_KEYS: FontTokenKey[] = ['heading', 'body', 'mono']

interface FontTokensEditorProps {
  tokens: ThemeTokens
  onChange: (key: FontTokenKey, value: string, href?: string) => void
}

function resolveToken(tokens: ThemeTokens, key: FontTokenKey): { value: string; href?: string } {
  const override = tokens.fonts?.[key] as { value: string; href?: string } | undefined
  return override ?? { value: fonts[key] }
}

export function FontTokensEditor({ tokens, onChange }: FontTokensEditorProps) {
  return (
    <VStack align="stretch" gap={5}>
      {FONT_KEYS.map(key => {
        const { value, href } = resolveToken(tokens, key)
        const googleFamily = parseGoogleFontFamily(href)

        return (
          <Box key={key} borderWidth="1px" borderColor={chrome.border} borderRadius="md" p={3}>
            <Text fontWeight="bold" fontSize="sm" mb={2} textTransform="capitalize" color={chrome.text}>{key}</Text>

            <Text fontSize="xs" color={chrome.mutedText} mb={1}>Load from Google Fonts</Text>
            <NativeSelect.Root size="sm" mb={3}>
              <NativeSelect.Field
                borderColor={chrome.border}
                bg={chrome.fieldBg}
                color={chrome.text}
                value={googleFamily}
                onChange={e => {
                  const family = e.target.value
                  if (!family) {
                    // "Custom" selected — detach from Google Fonts but keep the current value as-is.
                    onChange(key, value)
                    return
                  }
                  const nextHref = buildGoogleFontsHref(family)
                  const nextValue = buildFontFamilyValue(family, FONT_FALLBACKS[key])
                  onChange(key, nextValue, nextHref)
                }}
              >
                <option value="">— Custom (type below) —</option>
                {GOOGLE_FONT_OPTIONS.map(family => (
                  <option key={family} value={family}>{family}</option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator color={chrome.mutedText} />
            </NativeSelect.Root>

            <Text fontSize="xs" color={chrome.mutedText} mb={1}>Font-family CSS value</Text>
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
