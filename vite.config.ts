import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    // Enable gzip compression for production builds
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Enable brotli compression (better than gzip)
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  build: {
    // Enable gzip compression
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
    // Minify for smaller file sizes
    minify: 'esbuild',
    // Generate source maps for debugging (optional)
    sourcemap: false,
  },
  // Configure server compression for development
  server: {
    // Enable compression in development
    middlewareMode: false,
  },
})
