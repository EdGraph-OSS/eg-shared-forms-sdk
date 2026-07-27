import { Provider } from './ui'
import { ComponentStylesPanel, ThemeEditorPanel, useThemeEditorState } from './theme-editor'
import { Flex } from '@chakra-ui/react'

export function EditorMode() {
  const themeEditor = useThemeEditorState()

  return (
    <Provider
      recipes={themeEditor.recipes}
      slotRecipes={themeEditor.slotRecipes}
      tokens={themeEditor.tokens}>
      <Flex flexDir='column' gap='4' w='100%'>
        <ThemeEditorPanel
          recipes={themeEditor.recipes}
          slotRecipes={themeEditor.slotRecipes}
          tokens={themeEditor.tokens}
          onRecipeChange={themeEditor.setRecipeOverride}
          onSlotRecipeChange={themeEditor.setSlotRecipeOverride}
          onColorTokenChange={themeEditor.setColorToken}
          onColorTokenRemove={themeEditor.removeColorToken}
          onFontTokenChange={themeEditor.setFontToken}
          onReset={themeEditor.reset}
          onResetColors={themeEditor.resetColorTokens}
          onResetComponent={themeEditor.resetEntries}
          onLoadTheme={themeEditor.loadTheme} />
        <ComponentStylesPanel />
      </Flex>
    </Provider>
  )
}
