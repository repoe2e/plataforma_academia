import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: https://repoe2e.github.io/plataforma_academia/
const base = process.env.GITHUB_PAGES === 'true' ? '/plataforma_academia/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
})
