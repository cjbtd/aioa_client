import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const backend = 'http://127.0.0.1:82/'

export default defineConfig({
  build: {
    assetsDir: "static"
  },
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/variable.scss" as *;`,
      },
    },
  },
  plugins: [
    vue(),
  ],
  json: {
    stringify: true
  },
  server: {
    port: 8082,
    proxy: {
      '^/api': {
        target: backend,
        changeOrigin: true,
      },
      '^/admin': {
        target: backend,
        changeOrigin: true,
      },
      '^/static': {
        target: backend,
        changeOrigin: true,
      },
      '^/media': {
        target: backend,
        changeOrigin: true,
      },
      '^/ckeditor': {
        target: backend,
        changeOrigin: true,
      },
    }
  }
});
