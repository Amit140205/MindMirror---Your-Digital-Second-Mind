import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

export default defineConfig({
  plugins: [react()],

  build: {
    outDir: "dist",
    emptyOutDir: true,

    rollupOptions: {
      input: {
        popup:      resolve(__dirname, "popup.html"),
        newtab:     resolve(__dirname, "newtab.html"),
        background: resolve(__dirname, "src/background/background.js"),
        content:    resolve(__dirname, "src/content/content.js")
      },

      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
        assetFileNames: "assets/[name].[ext]"
      }
    }
  }
})