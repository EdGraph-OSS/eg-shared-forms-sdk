import { useCallback, useEffect, useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json, jsonParseLinter } from '@codemirror/lang-json'
import { linter } from '@codemirror/lint'
import { color } from '@uiw/codemirror-extensions-color'
import { Box, Text } from '@chakra-ui/react'

const extensions = [json(), linter(jsonParseLinter()), color]

interface JsonRecipeEditorProps {
  /** Identifies which recipe is being edited; text is reseeded whenever this changes. */
  editorKey: string
  value: unknown
  onChange: (parsed: unknown) => void
}

export function JsonRecipeEditor({ editorKey, value, onChange }: JsonRecipeEditorProps) {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2))
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    setText(JSON.stringify(value, null, 2))
    setError(null)
  }, [editorKey])

  const handleChange = useCallback((next: string) => {
    setText(next)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      try {
        const parsed = JSON.parse(next)
        setError(null)
        onChange(parsed)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Invalid JSON')
      }
    }, 250)
  }, [onChange])

  return (
    <Box>
      <CodeMirror value={text} height="360px" extensions={extensions} onChange={handleChange} />
      {error && (
        <Text fontSize="xs" color="red.500" mt={1}>
          {error}
        </Text>
      )}
    </Box>
  )
}
