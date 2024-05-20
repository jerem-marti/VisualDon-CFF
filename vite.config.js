// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020', // Set the target environment that supports top-level await
  },
});