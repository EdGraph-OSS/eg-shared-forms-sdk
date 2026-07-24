import { NativeSelect } from '@chakra-ui/react'
import { chrome } from './chromeColors'
import type { ComponentGroup } from './recipe-registry'

interface ComponentPickerProps {
  groups: ComponentGroup[]
  selected: ComponentGroup
  onSelect: (group: ComponentGroup) => void
}

export function ComponentPicker({ groups, selected, onSelect }: ComponentPickerProps) {
  const widgets = groups.filter(group => group.kind === 'widget')
  const templates = groups.filter(group => group.kind === 'template')

  return (
    <NativeSelect.Root flexDir='column' size="sm">
      <label htmlFor="component-picker" style={{ fontWeight: 'bold', color: chrome.text }}>Select Component</label>
      <NativeSelect.Field
        id='component-picker'
        value={selected.name}
        borderColor={chrome.border}
        bg={chrome.fieldBg}
        color={chrome.text}
        onChange={e => {
          const found = groups.find(group => group.name === e.target.value)
          if (found) onSelect(found)
        }}
      >
        {widgets.length > 0 && (
          <optgroup label="Widgets">
            {widgets.map(group => (
              <option key={group.name} value={group.name}>{group.label}</option>
            ))}
          </optgroup>
        )}
        {templates.length > 0 && (
          <optgroup label="Templates">
            {templates.map(group => (
              <option key={group.name} value={group.name}>{group.label}</option>
            ))}
          </optgroup>
        )}
      </NativeSelect.Field>
      <NativeSelect.Indicator color={chrome.mutedText} />
    </NativeSelect.Root>
  )
}
