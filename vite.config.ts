import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { readdirSync, statSync } from 'fs'

/** Paths relative to `src/` without extension, e.g. `utils/form`, `index`. */
function collectLibEntries(srcDir: string): Record<string, string> {
  const entries: Record<string, string> = {}
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      if (name === 'vite-env.d.ts') continue
      const full = resolve(dir, name)
      if (statSync(full).isDirectory()) {
        walk(full)
      } else if (/\.(ts|tsx)$/.test(name) && !name.endsWith('.d.ts')) {
        const rel = full.slice(srcDir.length + 1).replace(/\\/g, '/')
        const key = rel.replace(/\.(tsx?)$/, '')
        entries[key] = full
      }
    }
  }
  walk(srcDir)
  return entries
}

const srcRoot = resolve(__dirname, 'src')
const libEntry = collectLibEntries(srcRoot)

export default defineConfig({
  build: {
    lib: {
      entry: libEntry,
      formats: ['es', 'cjs'],
      fileName: (format, name) => `${name}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      output: {
        globals: {
          react: 'React',
        },
      },
      external: ['react', '@chakra-ui/react', 'react-dom'],
    },
  },
  plugins: [dts({ insertTypesEntry: true })],
})
