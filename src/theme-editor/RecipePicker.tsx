import { NativeSelect } from '@chakra-ui/react'
import type { RecipeEntryRef } from './recipe-registry'

interface RecipePickerProps {
  entries: RecipeEntryRef[]
  selected: RecipeEntryRef
  onSelect: (entry: RecipeEntryRef) => void
}

function entryId(entry: RecipeEntryRef) {
  return `${entry.kind}:${entry.key}`
}

export function RecipePicker({ entries, selected, onSelect }: RecipePickerProps) {
  const recipes = entries.filter(entry => entry.kind === 'recipe')
  const slotRecipes = entries.filter(entry => entry.kind === 'slotRecipe')

  return (
    <NativeSelect.Root flexDir='column' size="sm">
      <label htmlFor="recipe-picker" style={{ fontWeight: 'bold' }}>Select a recipe</label>
      <NativeSelect.Field
        id='recipe-picker'
        value={entryId(selected)}
        onChange={e => {
          const found = entries.find(entry => entryId(entry) === e.target.value)
          if (found) onSelect(found)
        }}>
        {recipes.length > 0 && (
          <optgroup label="Recipes">
            {recipes.map(entry => (
              <option key={entryId(entry)} value={entryId(entry)}>{entry.key}</option>
            ))}
          </optgroup>
        )}
        {slotRecipes.length > 0 && (
          <optgroup label="Slot Recipes">
            {slotRecipes.map(entry => (
              <option key={entryId(entry)} value={entryId(entry)}>{entry.key}</option>
            ))}
          </optgroup>
        )}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  )
}
