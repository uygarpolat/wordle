import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Enable React fast refresh and JSX transform
export default defineConfig({
  plugins: [react()],
})
