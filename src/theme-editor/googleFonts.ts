import type { FontTokenKey } from './useThemeEditorState'

export const GOOGLE_FONT_OPTIONS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Nunito',
  'Source Sans 3',
  'Raleway',
  'Merriweather',
  'Playfair Display',
  'Work Sans',
  'DM Sans',
  'Rubik',
  'Fira Sans',
  'Space Grotesk',
  'IBM Plex Sans',
  'IBM Plex Mono',
  'JetBrains Mono',
  'Roboto Mono',
] as const

export const FONT_FALLBACKS: Record<FontTokenKey, string> = {
  heading: 'sans-serif',
  body: 'sans-serif',
  mono: 'monospace',
}

const DEFAULT_WEIGHTS = [400, 600, 700]

/** Builds a Google Fonts CSS2 stylesheet URL for the given family (e.g. `https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap`). */
export function buildGoogleFontsHref(family: string, weights: number[] = DEFAULT_WEIGHTS): string {
  const weightList = [...new Set(weights)].sort((a, b) => a - b).join(';')
  const params = new URLSearchParams({ family: `${family}:wght@${weightList}`, display: 'swap' })
  return `https://fonts.googleapis.com/css2?${params.toString()}`
}

/** Builds the CSS `font-family` value to pair with a Google Fonts href, e.g. `'Inter', sans-serif`. */
export function buildFontFamilyValue(family: string, fallback: string): string {
  return `'${family}', ${fallback}`
}

/** Recovers the family name from a Google Fonts href built by `buildGoogleFontsHref`, or `''` if not a recognized Google Fonts URL. */
export function parseGoogleFontFamily(href?: string): string {
  if (!href) return ''
  try {
    const family = new URL(href).searchParams.get('family') ?? ''
    return family.split(':')[0]
  } catch {
    return ''
  }
}
