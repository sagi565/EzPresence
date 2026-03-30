import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      basicSsl()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@models': path.resolve(__dirname, './src/models'),
        '@auth': path.resolve(__dirname, './src/auth'),
        '@lib': path.resolve(__dirname, './src/lib'),
        '@theme': path.resolve(__dirname, './src/theme'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@context': path.resolve(__dirname, './src/context'),
      },
    },
    server: {
      https: {},
      port: Number(env.VITE_PORT) || 5173,
      host: '192.168.1.27',
      strictPort: true,
    },
  }
})