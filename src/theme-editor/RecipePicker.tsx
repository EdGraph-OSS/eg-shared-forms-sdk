import { NativeSelect } from '@chakra-ui/react'
import type { RecipeEntryRef } from './recipe-registry'
import { entryId, isGlobalEntry } from './recipe-registry'
import { chrome } from './chromeColors'

interface RecipePickerProps {
  entries: RecipeEntryRef[]
  selected: RecipeEntryRef
  onSelect: (entry: RecipeEntryRef) => void
}

function optionLabel(entry: RecipeEntryRef): string {
  return isGlobalEntry(entry) ? `${entry.key} (Global)` : entry.key
}

export function RecipePicker({ entries, selected, onSelect }: RecipePickerProps) {
  const recipes = entries.filter(entry => entry.kind === 'recipe')
  const slotRecipes = entries.filter(entry => entry.kind === 'slotRecipe')

  return (
    <div>
      <label htmlFor="recipe-picker" style={{ fontWeight: 'bold', color: chrome.text }}>Select a recipe</label>
      <NativeSelect.Root size="sm" mt='8px'>
        <NativeSelect.Field
          id='recipe-picker'
          value={entryId(selected)}
          borderColor={chrome.border}
          bg={chrome.fieldBg}
          color={chrome.text}
          _hover={{ borderColor: chrome.primaryBrand, boxShadow: `0 0 3px ${chrome.primaryBrand}` }}
          _focusVisible={{ borderColor: chrome.primaryBrand, boxShadow: `0 0 0 1px ${chrome.primaryBrand}` }}
          onChange={e => {
            const found = entries.find(entry => entryId(entry) === e.target.value)
            if (found) onSelect(found)
          }}>
          {recipes.length > 0 && (
            <optgroup label="Recipes">
              {recipes.map(entry => (
                <option key={entryId(entry)} value={entryId(entry)}>{optionLabel(entry)}</option>
              ))}
            </optgroup>
          )}
          {slotRecipes.length > 0 && (
            <optgroup label="Slot Recipes">
              {slotRecipes.map(entry => (
                <option key={entryId(entry)} value={entryId(entry)}>{optionLabel(entry)}</option>
              ))}
            </optgroup>
          )}
        </NativeSelect.Field>
        <NativeSelect.Indicator color={chrome.mutedText} />
      </NativeSelect.Root>
    </div>
  )
}
