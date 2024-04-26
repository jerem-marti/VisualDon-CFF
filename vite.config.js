import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import dsv from '@rollup/plugin-dsv'

export default defineConfig({
    plugins: [
        dsv(),
        nodePolyfills(),
    ],
})