import { Box, Flex, Grid, Text, VStack } from '@chakra-ui/react'
import { colors } from '../ui'
import type { ThemeTokens } from './useThemeEditorState'

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

interface ColorTokensEditorProps {
  tokens: ThemeTokens
  onChange: (scale: string, shade: string, value: string) => void
}

function resolveValue(tokens: ThemeTokens, scale: string, shade: string): string {
  const override = (tokens.colors?.[scale] as Record<string, { value: string }> | undefined)?.[shade]
  if (override) return override.value
  return (colors as Record<string, Record<string, string>>)[scale][shade]
}

export function ColorTokensEditor({ tokens, onChange }: ColorTokensEditorProps) {
  return (
    <VStack align="stretch" gap={5}>
      {Object.entries(colors).map(([scale, shades]) => (
        <Box key={scale} borderWidth="1px" borderRadius="md" p={3}>
          <Text fontWeight="bold" fontSize="sm" mb={2} textTransform="capitalize">{scale}</Text>
          <Grid templateColumns="repeat(auto-fill, 160px)" alignItems='center' gap={3}>
            {Object.keys(shades).map(shade => {
              const value = resolveValue(tokens, scale, shade)
              const swatch = HEX_RE.test(value) ? value : '#000000'
              return (
                <Flex key={shade} alignItems='center' h='40px' gap={2}>
                  <input
                    type="color"
                    value={swatch}
                    onChange={e => onChange(scale, shade, e.target.value)}
                    style={{ width: 40, height: 40, padding: 0, border: 'none', background: 'none', flexShrink: 0 }}
                  />
                  <Text fontSize="xs" color="gray.500">{shade}</Text>
                </Flex>
              )
            })}
          </Grid>
        </Box>
      ))}
    </VStack>
  )
}
