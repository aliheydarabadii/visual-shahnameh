import { defineConfig } from "cf/config";

export default defineConfig({
  accountId: "749525dc896fae3c8a92391c481ee4e3",
  worker: {
    name: "visual-shahnameh",
    compatibilityDate: "2026-11-05",
    domains: ["shahnameh.world"],
    workersDev: true,
    previewUrls: false,
    assets: { notFoundHandling: "single-page-application" },
  },
});
