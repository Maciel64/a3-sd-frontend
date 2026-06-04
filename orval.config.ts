import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "http://localhost:3001/openapi/json",
    },
    output: {
      target: "./src/lib/api/client.ts",
      schemas: "./src/lib/api/model",
      client: "react-query",
      mode: "split",
      override: {
        mutator: {
          path: "src/infra/api.ts",
          name: "axiosMutator",
        },
      },
    },
  },
});
