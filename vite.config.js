import { defineConfig } from "vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { glob } from "glob";

import liveReload from "vite-plugin-live-reload";

function moveOutputPlugin() {
  return {
    name: "move-output",
    enforce: "post",
    apply: "build",
    async generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (fileName.startsWith("pages/")) {
          const newFileName = fileName.slice("pages/".length);
          bundle[fileName].fileName = newFileName;
        }
      }
    },
  };
}

export default defineConfig(({ mode }) => ({
  // 本地開發用 "/"，部署 (build) 才用 repo 名
  base: mode === "development" ? "/" : "/HW-main-quest-3st-4st-2/",
  plugins: [
    liveReload(["./layout/**/*.ejs", "./pages/**/*.ejs", "./pages/**/*.html"]),
    ViteEjsPlugin(),
    moveOutputPlugin(),
  ],
  server: {
    open: "/pages/index.html", // dev server 預設打開首頁
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync("pages/**/*.html")
          .map((file) => [
            path.relative(
              "pages",
              file.slice(0, file.length - path.extname(file).length)
            ),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
    },
  },
}));
