import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

export default defineConfig(({ command }) => {
  const isDev = command === "serve";
  const keyPath = path.resolve("./localhost+1-key.pem");
  const certPath = path.resolve("./localhost+1.pem");
  const hasCerts = fs.existsSync(keyPath) && fs.existsSync(certPath);

  return {
    plugins: [react()],
    server: {
      host: true,
      ...(isDev && hasCerts
        ? {
            https: {
              key: fs.readFileSync(keyPath),
              cert: fs.readFileSync(certPath),
            },
          }
        : {}),
    },
  };
});
