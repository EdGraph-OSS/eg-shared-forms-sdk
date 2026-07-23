import { syntaxTree } from '@codemirror/language'
import type { Range } from '@codemirror/state'
import { Decoration, ViewPlugin, WidgetType } from '@codemirror/view'
import type { DecorationSet, EditorView, ViewUpdate } from '@codemirror/view'

/**
 * `@uiw/codemirror-extensions-color` detects colors via CSS-grammar syntax-tree
 * node names (ColorLiteral / CallExpression / ValueName). Those node types don't
 * exist in a JSON parse tree, so it never renders swatches here. This scans JSON
 * `String` nodes directly for color-like values instead.
 */

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const RGB_RE = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*[\d.]+\s*)?\)$/i
const HSL_RE = /^hsla?\(\s*(-?[\d.]+)(?:deg)?\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*[\d.]+\s*)?\)$/i

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)))
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => clampByte(v).toString(16).padStart(2, '0')).join('')
}

function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100
  const lNorm = l / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = sNorm * Math.min(lNorm, 1 - lNorm)
  const f = (n: number) => lNorm - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255)
}

function toHex(value: string): string | null {
  if (HEX_RE.test(value)) {
    const hex = value.slice(1)
    if (hex.length === 3 || hex.length === 4) {
      return '#' + hex.slice(0, 3).split('').map((c) => c + c).join('')
    }
    return '#' + hex.slice(0, 6)
  }
  const rgbMatch = RGB_RE.exec(value)
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch
    return rgbToHex(Number(r), Number(g), Number(b))
  }
  const hslMatch = HSL_RE.exec(value)
  if (hslMatch) {
    const [, h, s, l] = hslMatch
    return hslToHex(Number(h), Number(s), Number(l))
  }
  return null
}

class ColorSwatchWidget extends WidgetType {
  constructor(private readonly hex: string, private readonly from: number, private readonly to: number) {
    super()
  }

  eq(other: ColorSwatchWidget): boolean {
    return other.hex === this.hex && other.from === this.from && other.to === this.to
  }

  toDOM(view: EditorView): HTMLElement {
    const input = document.createElement('input')
    input.type = 'color'
    input.value = this.hex
    input.dataset.color = this.hex
    input.dataset.from = String(this.from)
    input.dataset.to = String(this.to)
    input.addEventListener('input', (event) => {
      event.stopPropagation()
      const next = (event.target as HTMLInputElement).value
      const from = Number(input.dataset.from)
      const to = Number(input.dataset.to)
      view.dispatch({ changes: { from, to, insert: next } })
    })

    const wrapper = document.createElement('span')
    wrapper.dataset.color = this.hex
    wrapper.style.backgroundColor = this.hex
    wrapper.appendChild(input)
    return wrapper
  }

  updateDOM(dom: HTMLElement): boolean {
    const input = dom.querySelector('input')
    if (!input) return false
    dom.dataset.color = this.hex
    dom.style.backgroundColor = this.hex
    input.value = this.hex
    input.dataset.color = this.hex
    input.dataset.from = String(this.from)
    input.dataset.to = String(this.to)
    return true
  }

  ignoreEvent(): boolean {
    return true
  }
}

function buildDecorations(view: EditorView): DecorationSet {
  const widgets: Range<Decoration>[] = []
  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter: (node) => {
        if (node.type.name !== 'String') return
        const raw = view.state.doc.sliceString(node.from, node.to)
        if (raw.length < 2) return
        const inner = raw.slice(1, -1)
        const hex = toHex(inner)
        if (!hex) return
        widgets.push(
          Decoration.widget({
            widget: new ColorSwatchWidget(hex, node.from + 1, node.to - 1),
            side: 0,
          }).range(node.from)
        )
      },
    })
  }
  return Decoration.set(widgets)
}

export const jsonColorWidgets = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet

    constructor(view: EditorView) {
      this.decorations = buildDecorations(view)
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = buildDecorations(update.view)
      }
    }
  },
  { decorations: (v) => v.decorations }
)
