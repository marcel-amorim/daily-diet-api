import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: './vitest.setup.ts', // Path to the setup file
    environment: 'node', // Set environment if needed
  },
})
