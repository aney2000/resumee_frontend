/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Named, cacheable vendor chunks for the (lazily loaded) 3D stack. React and Vite's runtime
// helpers are pinned to the eager vendor-react chunk; otherwise Rollup hoists them into a
// 3D chunk and the entry would statically import (and modulepreload) the whole 3D stack.
const VENDOR_CHUNKS: ReadonlyArray<readonly [RegExp, string]> = [
  [
    /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]|^\0vite[\\/]|commonjsHelpers/,
    'vendor-react',
  ],
  [/[\\/]node_modules[\\/]@dimforge[\\/]/, 'vendor-rapier'],
  [/[\\/]node_modules[\\/]@react-three[\\/]/, 'vendor-r3f'],
  [/[\\/]node_modules[\\/]three[\\/]/, 'vendor-three'],
];

function vendorChunkFor(id: string): string | undefined {
  return VENDOR_CHUNKS.find(([pattern]) => pattern.test(id))?.[1];
}

export default defineConfig({
  plugins: [react()],
  server: {
    // Bind mounts (Docker on Windows/macOS) emit no fs events; polling is opt-in via env.
    watch: { usePolling: process.env.CHOKIDAR_USEPOLLING === 'true' },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // vendor-rapier is ~2 MB because Rapier ships its physics WASM base64-inlined; it cannot be split further.
    chunkSizeWarningLimit: 2200,
    rollupOptions: {
      output: {
        manualChunks: vendorChunkFor,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/main.tsx', 'src/vite-env.d.ts'],
    },
  },
});
