import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Corti is 9243. Not 8080; 8080 is the lab. Not 5485, 5486 or 5487:
// those are AlphaVox's acoustic keys, its Corti receiver, and the ear inside it.
// Standing rule: nothing binds the wildcard. This machine only, 127.0.0.1.
export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 9243,
    strictPort: true,
  },
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), tanstackStart(), viteReact()],
});
