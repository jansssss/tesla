import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// lib 모듈 일부가 Next의 "@/..." 경로 별칭을 쓴다(jsconfig.json paths).
// vitest는 jsconfig를 읽지 않으므로 같은 별칭을 여기서 다시 선언한다.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
