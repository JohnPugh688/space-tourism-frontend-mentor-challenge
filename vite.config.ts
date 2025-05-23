import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { vercelPreset } from '@vercel/remix/vite'

installGlobals()

export default defineConfig({
  plugins: [
    remix({
      presets: [vercelPreset()],
    }),
    tsconfigPaths(),
    tailwindcss(),
  ],
  server: {
    fs: {
      // Restrict files that could be served by Vite's dev server.  Accessing
      // files outside this directory list that aren't imported from an allowed
      // file will result in a 403.  Both directories and files can be provided.
      // If you're comfortable with Vite's dev server making any file within the
      // project root available, you can remove this option.  See more:
      // https://vitejs.dev/config/server-options.html#server-fs-allow
      allow: ['app', 'public'],
    },
    host: '0.0.0.0', // Expose to all network interfaces
    port: 5173, // Set explicit port
  },
})
