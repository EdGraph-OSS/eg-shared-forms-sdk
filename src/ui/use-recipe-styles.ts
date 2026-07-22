import { useMemo } from 'react'
import { useChakraContext } from '@chakra-ui/react'
import type {
  RecipeDefinition,
  RecipeVariantMap,
  RecipeVariantProps,
  SlotRecipeConfig,
  SystemRecipeFn,
  SystemSlotRecipeFn,
} from '@chakra-ui/react'

/**
 * Like Chakra's `useSlotRecipe({ key, recipe })`, but actually honors `key`.
 * Chakra's own hook does `recipeProp || sys.getSlotRecipe(key)` — since the
 * fallback `recipe` argument is always truthy, it unconditionally wins,
 * silently ignoring any theme override registered under `key` (e.g. via
 * `<Provider slotRecipes={{ infoCard: {...} }} />`). This resolves `key`
 * against the live system first and only falls back to `recipe` if the
 * system has nothing registered for it.
 */
export function useRecipeStyles<R extends SlotRecipeConfig>(
  key: string,
  recipe: R,
): R extends SlotRecipeConfig<infer S, infer T>
  ? SystemSlotRecipeFn<S, RecipeVariantProps<R>, RecipeVariantMap<T>>
  : never {
  const sys = useChakraContext()
  return useMemo(
    () => sys.sva(structuredClone(sys.getSlotRecipe(key) ?? recipe)),
    [key, recipe, sys],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any
}

/** Single-part-recipe counterpart of {@link useRecipeStyles} — same fix, for Chakra's `useRecipe`. */
export function useSingleRecipeStyles<R extends RecipeDefinition>(
  key: string,
  recipe: R,
): R extends RecipeDefinition<infer T>
  ? SystemRecipeFn<RecipeVariantProps<R>, RecipeVariantMap<T>>
  : never {
  const sys = useChakraContext()
  return useMemo(
    () => sys.cva(structuredClone(sys.getRecipe(key) ?? recipe)),
    [key, recipe, sys],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any
}
