import { useCallback, useState } from 'react'
import type { ThemingConfig } from '@chakra-ui/react'
import type { ProviderRecipes, ProviderSlotRecipes, RecipesRegistry, SlotRecipesRegistry, ThemeConfig } from '../ui'
import type { RecipeEntryRef } from './recipe-registry'

export type ThemeTokens = NonNullable<ThemingConfig['tokens']>
export type FontTokenKey = 'heading' | 'body' | 'mono'

// `initialTheme` is shaped like `ThemeConfig` — the same `{ recipes, slotRecipes, tokens }`
// object `ExportPanel` produces — so a previously-exported theme can be loaded back in
// as-is to seed the editor.
export function useThemeEditorState(initialTheme: ThemeConfig = {}) {
  const [recipes, setRecipes] = useState<ProviderRecipes>(initialTheme.recipes ?? {})
  const [slotRecipes, setSlotRecipes] = useState<ProviderSlotRecipes>(initialTheme.slotRecipes ?? {})
  const [tokens, setTokens] = useState<ThemeTokens>(initialTheme.tokens ?? {})

  // Values come from a hand-typed JSON editor, so there's no compile-time guarantee
  // they match the recipe's real shape — accept `unknown` here rather than pretending
  // otherwise, and let Chakra's runtime recipe merge be the actual source of truth.
  const setRecipeOverride = useCallback((key: keyof RecipesRegistry, value: unknown) => {
    setRecipes(prev => ({ ...prev, [key]: value }))
  }, [])

  const setSlotRecipeOverride = useCallback((key: keyof SlotRecipesRegistry, value: unknown) => {
    setSlotRecipes(prev => ({ ...prev, [key]: value }))
  }, [])

  // Token values come from color/text inputs rather than the strict recursive
  // TokenDefinition shape, so build the override as a plain object and cast it —
  // same rationale as setRecipeOverride's `unknown` above.
  const setColorToken = useCallback((scale: string, shade: string, value: string) => {
    setTokens(prev => ({
      ...prev,
      colors: {
        ...(prev.colors as Record<string, unknown> | undefined),
        [scale]: {
          ...(prev.colors?.[scale] as Record<string, unknown> | undefined),
          [shade]: { value },
        },
      },
    } as ThemeTokens))
  }, [])

  const removeColorToken = useCallback((scale: string, shade: string) => {
    setTokens(prev => {
      const overrides = prev.colors as Record<string, Record<string, unknown>> | undefined
      if (!overrides?.[scale]?.[shade]) return prev
      const { [shade]: _removed, ...restShades } = overrides[scale]
      const nextColors = { ...overrides }
      if (Object.keys(restShades).length > 0) nextColors[scale] = restShades
      else delete nextColors[scale]
      return { ...prev, colors: nextColors } as ThemeTokens
    })
  }, [])

  // `href` is an optional loader hint (e.g. a Google Fonts stylesheet URL) carried
  // alongside the CSS value — Chakra ignores the extra key, but `Provider` and
  // `ExportPanel` read it back out to actually load the font asset. Omitting it
  // (e.g. after a manual edit) drops any previously-set href for that key.
  const setFontToken = useCallback((key: FontTokenKey, value: string, href?: string) => {
    setTokens(prev => ({
      ...prev,
      fonts: {
        ...(prev.fonts as Record<string, unknown> | undefined),
        [key]: href ? { value, href } : { value },
      },
    } as ThemeTokens))
  }, [])

  const reset = useCallback(() => {
    setRecipes({})
    setSlotRecipes({})
    setTokens({})
  }, [])

  const resetColorTokens = useCallback(() => {
    setTokens(prev => {
      const { colors: _colors, ...rest } = prev
      return rest as ThemeTokens
    })
  }, [])

  // Loading a previously-exported theme file replaces recipes/slotRecipes/tokens
  // wholesale rather than merging — the file is the new source of truth, so any
  // in-progress overrides not present in it should be dropped, same as `reset`.
  const loadTheme = useCallback((theme: ThemeConfig) => {
    setRecipes(theme.recipes ?? {})
    setSlotRecipes(theme.slotRecipes ?? {})
    setTokens((theme.tokens ?? {}) as ThemeTokens)
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

  return {
    recipes,
    slotRecipes,
    tokens,
    setRecipeOverride,
    setSlotRecipeOverride,
    setColorToken,
    removeColorToken,
    setFontToken,
    reset,
    resetColorTokens,
    resetEntries,
    loadTheme,
  }
}
