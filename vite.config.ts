import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";

/**
 * Paintings and VITE_ART_BASE (see src/content/art.ts and DEPLOY.md):
 * - With VITE_ART_BASE set, production points paintings at R2. Otherwise
 *   optimized paintings ship alongside the site through Workers Static Assets.
 * - In development, painting URLs stay local (/art/…). A file that isn't in
 *   public/art (pruned after upload) is redirected to R2, so a machine can
 *   keep only the paintings it is working on.
 */
export default defineConfig(({ mode, command }) => {
  const artBase = loadEnv(mode, process.cwd(), "VITE_").VITE_ART_BASE?.replace(/\/$/, "");
  return {
    plugins: [
      // Local reading/check servers stay plain Vite. Production builds also
      // emit Cloudflare Build Output for cf deploy --prebuilt.
      ...(command === "build" ? [cloudflare()] : []),
      {
        name: "art-from-r2",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const path = req.url?.split("?")[0] ?? "";
            if (artBase && path.startsWith("/art/") && !existsSync(resolve("public" + decodeURIComponent(path)))) {
              res.statusCode = 302;
              res.setHeader("Location", artBase + path);
              return res.end();
            }
            next();
          });
        },
        closeBundle() {
          if (artBase) rmSync(resolve("dist/art"), { recursive: true, force: true });
        },
      },
    ],
  };
});
