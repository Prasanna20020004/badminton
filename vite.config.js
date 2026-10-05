import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The source predates this build setup and uses .js extensions for files
// containing JSX (App.js, pages/*.jsx mixed with .js, etc.), so esbuild needs
// to be told to treat .js files as JSX too.
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { ".js": "jsx" },
    },
  },
});
