import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://ec2-54-180-133-86.ap-northeast-2.compute.amazonaws.com:3000"
      }
    }
  },
})