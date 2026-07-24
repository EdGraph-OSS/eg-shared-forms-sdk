/**
 * Fixed hex colors for the theme editor's own chrome (panels, pickers, buttons, export box).
 * These are literal values, not theme tokens, so editing a color token (e.g. gray.100) in the
 * editor never changes the editor's own UI — only the live component preview should react to that.
 */
export const chrome = {
  border: '#e5e5e5',
  borderDark: '#404040',
  panelBg: '#fafafa',
  panelBgDark: '#171717',
  fieldBg: '#ffffff',
  fieldBgDark: '#262626',
  text: '#171717',
  textDark: '#fafafa',
  mutedText: '#737373',
  buttonBg: '#171717',
  buttonBgHover: '#000000',
  buttonBgDark: '#fafafa',
  buttonBgHoverDark: '#e5e5e5',
  errorText: '#c53030',
} as const
