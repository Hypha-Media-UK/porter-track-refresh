// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import netlify from '@astrojs/netlify';

/**
 * Porter Track - Astro Configuration
 * 
 * This configuration includes Vue.js integration with the composition API,
 * enabling TypeScript for better type checking, and optimizing application 
 * performance through server-side rendering.
 */
export default defineConfig({
  // Use Vue.js integration with support for TypeScript and the Composition API
  integrations: [vue()],

  // Set output to server mode to enable API endpoints
  output: 'server',
  adapter: netlify({
    edgeMiddleware: true // Enable edge middleware for better performance
  }),

  // Base configuration
  base: '/',
  outDir: './dist',
  
  // Server configuration
  server: {
    host: '0.0.0.0', // Allow connections from any IP
    port: 3000
  },
  
  // Build configuration
  build: {
    format: 'file',
    assets: 'assets'
  },
  
  // Vite configuration for advanced optimizations
  vite: {
    build: {
      // Optimize production build
      minify: 'terser',
      // Chunk splitting for better performance
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            // Bundle all Vue-related dependencies together
            vue: ['vue', 'pinia']
          }
        }
      }
    },
    css: {
      // Enable source maps in development
      devSourcemap: true
    },
    // Optimize Vue plugin settings
    plugins: [],
    // Optimize dependencies
    optimizeDeps: {
      include: ['vue', 'pinia', 'date-fns']
    }
  }
});
