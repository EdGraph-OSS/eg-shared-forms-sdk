import {
  ChakraProvider
} from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import type { ColorModeProviderProps } from './color-mode'
import {
  createSystem,
  defaultConfig,
  defineConfig,
} from '@chakra-ui/react'
import { colors } from './theme'

export function Provider(props: ColorModeProviderProps) {
  const theme = defineConfig({
    theme: {
      semanticTokens: {
        colors: {
          primary: { value: colors.primary.DEFAULT },
          accent: { value: colors.accent.DEFAULT },
          success: { value: colors.success.DEFAULT },
          info: { value: colors.info.DEFAULT },
          warning: { value: colors.bg.DEFAULT },
          error: { value: colors.error.DEFAULT },
        },
      },
    },
  })
  const isDarkMode = localStorage.getItem("selectedDarkMode") === "true"
  const system = createSystem(defaultConfig, theme)

  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} defaultTheme={isDarkMode ? "dark" : "light"} />
    </ChakraProvider>
  )
}
