import { Provider } from './ui'
import { ThemeEditorPanel, useThemeEditorState } from './theme-editor'

// Renders the theme editor with its own `Provider`, live-bound to the editor's
// in-progress recipes/slotRecipes/tokens — independent of `DevMode`'s theme.
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
        onResetComponent={themeEditor.resetEntries} />
    </Provider>
  )
}
