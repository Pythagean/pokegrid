import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set `base` to the repository name so GitHub Pages serves assets from
// https://<user>.github.io/<repo>/...
export default defineConfig({
  base: '/pokegrid/',
  plugins: [react()]
})
