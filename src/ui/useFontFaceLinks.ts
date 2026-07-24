import { useEffect } from 'react'

const FONT_FACE_ATTR = 'data-eg-font-face'

/**
 * Reconciles `<link rel="stylesheet">` tags in `<head>` against a `{ key: href }` map.
 * Theme tokens only carry the CSS `font-family` string — never the font asset — so
 * anything referencing an external font (e.g. Google Fonts) needs this to actually
 * render with that font instead of silently falling back.
 */
export function useFontFaceLinks(fontFaces: Record<string, string>) {
  const signature = JSON.stringify(fontFaces)

  useEffect(() => {
    const desired = JSON.parse(signature) as Record<string, string>

    document.head.querySelectorAll(`link[${FONT_FACE_ATTR}]`).forEach(link => {
      const key = link.getAttribute(FONT_FACE_ATTR)
      if (!key || desired[key] !== link.getAttribute('href')) link.remove()
    })

    for (const [key, href] of Object.entries(desired)) {
      const alreadyPresent = Array.from(
        document.head.querySelectorAll(`link[${FONT_FACE_ATTR}]`),
      ).some(link => link.getAttribute(FONT_FACE_ATTR) === key)
      if (alreadyPresent) continue

      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.setAttribute(FONT_FACE_ATTR, key)
      document.head.appendChild(link)
    }
  }, [signature])
}
