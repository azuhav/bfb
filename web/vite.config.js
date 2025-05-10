import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log('Command:', command);
  console.log('Mode:', mode);
  if (mode === 'development') {
    return {
      plugins: [react()],
      server: {
        host: true,
        port: 3000,
        watch: {
          usePolling: true,
        },
        allowedHosts: ['web']
      },
    }
  } else {
    return {
      plugins: [react()],
    }
  }
})