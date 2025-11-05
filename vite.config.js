import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src") // "@" ko src folder se map karta hai
    }
  },
  server: {
    host: true,
    port: 3000,
  }
});
