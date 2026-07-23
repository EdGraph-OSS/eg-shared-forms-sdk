import { useCallback, useState } from 'react'
import type { ProviderRecipes, ProviderSlotRecipes, RecipesRegistry, SlotRecipesRegistry } from '../ui'
import type { RecipeEntryRef } from './recipe-registry'

export function useThemeEditorState(
  initialRecipes: ProviderRecipes = {},
  initialSlotRecipes: ProviderSlotRecipes = {},
) {
  const [recipes, setRecipes] = useState<ProviderRecipes>(initialRecipes)
  const [slotRecipes, setSlotRecipes] = useState<ProviderSlotRecipes>(initialSlotRecipes)

  // Values come from a hand-typed JSON editor, so there's no compile-time guarantee
  // they match the recipe's real shape — accept `unknown` here rather than pretending
  // otherwise, and let Chakra's runtime recipe merge be the actual source of truth.
  const setRecipeOverride = useCallback((key: keyof RecipesRegistry, value: unknown) => {
    setRecipes(prev => ({ ...prev, [key]: value }))
  }, [])

  const setSlotRecipeOverride = useCallback((key: keyof SlotRecipesRegistry, value: unknown) => {
    setSlotRecipes(prev => ({ ...prev, [key]: value }))
  }, [])

  const reset = useCallback(() => {
    setRecipes({})
    setSlotRecipes({})
  }, [])

  const resetEntries = useCallback((entries: RecipeEntryRef[]) => {
    setRecipes(prev => {
      const next = { ...prev }
      for (const entry of entries) {
        if (entry.kind === 'recipe') delete next[entry.key]
      }
      return next
    })
    setSlotRecipes(prev => {
      const next = { ...prev }
      for (const entry of entries) {
        if (entry.kind === 'slotRecipe') delete next[entry.key]
      }
      return next
    })
  }, [])

  return { recipes, slotRecipes, setRecipeOverride, setSlotRecipeOverride, reset, resetEntries }
}
