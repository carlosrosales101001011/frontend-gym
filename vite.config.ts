import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import babel from '@rolldown/plugin-babel'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true
      }
    }
  },
  plugins: [
    react(),
    // babel({ presets: [reactCompilerPreset()] })
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      classnames: "classnames/index.js",
      
    }
  }
})
