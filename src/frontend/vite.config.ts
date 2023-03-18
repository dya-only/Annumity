import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://ec2-3-35-170-156.ap-northeast-2.compute.amazonaws.com"
      }
    }
  },
})