import { Provider } from './ui'
import { ThemeEditorPanel, useThemeEditorState } from './theme-editor'

export function EditorMode() {
  const themeEditor = useThemeEditorState()

  return (
    <Provider
      recipes={themeEditor.recipes}
      slotRecipes={themeEditor.slotRecipes}
      tokens={themeEditor.tokens}>
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
    </Provider>
  )
}
