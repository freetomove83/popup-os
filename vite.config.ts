import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// onoffcheck 관례를 그대로 따른다.
// 빌드 산출물은 Laravel(backend/public/build)로 넣어 동일 출처에서 서빙한다.
// 개발 중에는 5173(Vite) → 8000(Laravel) 으로 API 를 프록시한다.
const LARAVEL_BUILD_DIR = path.resolve(
  import.meta.dirname,
  "backend",
  "public",
  "build",
);

export default defineConfig(({ command }) => {
  const isBuild = command === "build";

  return {
    base: isBuild ? "/build/" : "/",
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
      },
    },
    envDir: path.resolve(import.meta.dirname),
    root: path.resolve(import.meta.dirname, "client"),
    publicDir: path.resolve(import.meta.dirname, "client", "public"),
    build: {
      outDir: isBuild
        ? LARAVEL_BUILD_DIR
        : path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      host: true,
      port: 5173,
      proxy: {
        "/api": { target: "http://127.0.0.1:8000", changeOrigin: true },
        "/storage": { target: "http://127.0.0.1:8000", changeOrigin: true },
      },
    },
  };
});
