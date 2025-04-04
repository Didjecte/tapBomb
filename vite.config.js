// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' ? '/tapBomb/' : '/',
  }
})