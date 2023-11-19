import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    clean: true,
    shims: true,
    dts: true,
    format: ['cjs'],
    publicDir: './src/components/AuthenticationStack/public'
})