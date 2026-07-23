import { useMemo, useState } from 'react'
import { Box, Button, Code, HStack } from '@chakra-ui/react'
import type { ProviderRecipes, ProviderSlotRecipes } from '../ui'

interface ExportPanelProps {
  recipes: ProviderRecipes
  slotRecipes: ProviderSlotRecipes
}

export function ExportPanel({ recipes, slotRecipes }: ExportPanelProps) {
  const code = useMemo(() => {
    return `import type { ProviderRecipes, ProviderSlotRecipes } from '@edgraph-oss/shared-forms/ui'

export const recipes: ProviderRecipes = ${JSON.stringify(recipes, null, 2)}

export const slotRecipes: ProviderSlotRecipes = ${JSON.stringify(slotRecipes, null, 2)}
`
  }, [recipes, slotRecipes])

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Box>
      <HStack justify="space-between" mb={2}>
        <Box fontWeight="semibold" fontSize="sm">Exported theme</Box>
        <Button size="xs" onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</Button>
      </HStack>
      <Code as="pre" display="block" whiteSpace="pre" overflowX="auto" maxH="240px" overflowY="auto" p={3} fontSize="xs">
        {code}
      </Code>
    </Box>
  )
}
