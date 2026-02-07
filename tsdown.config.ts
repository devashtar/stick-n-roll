import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  minify: true,
  outDir: "dist",
  outputOptions: {
    exports: "named",
  },
  platform: "neutral",
  sourcemap: true,
  target: "es2020",
});
