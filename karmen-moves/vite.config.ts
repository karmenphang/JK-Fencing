import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build` → normal multi file build for Cloudflare Pages (dist/)
// `npm run build:preview` → one self contained HTML file for quick previews
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === 'singlefile' ? [viteSingleFile()] : [])],
  build: {
    outDir: mode === 'singlefile' ? 'dist-preview' : 'dist',
    target: 'es2020',
    cssCodeSplit: false,
  },
}))
