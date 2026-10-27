// extensions/behaviors/http_check.ts
import { z } from "npm:zod@4";

const GlobalArgsSchema = z.object({
  url: z.string().url().describe("The URL to check"),
  timeout: z
    .number()
    .positive()
    .default(5000)
    .describe("Request timeout in milliseconds"),
});

const ResultSchema = z.object({
  status: z.number().describe("HTTP status code, or 0 if the request failed"),
  latency: z.number().describe("Response time in milliseconds"),
  ok: z.boolean().describe("True when status is 2xx and the request completed"),
});

export const behavior = {
  type: "@tutorial/http-check",
  version: "2026.07.28.1",

  globalArguments: GlobalArgsSchema,

  resources: {
    result: {
      description: "Health check result for a single endpoint",
      schema: ResultSchema,
      lifetime: "infinite" as const,
      garbageCollection: 100,
    },
  },

  methods: {
    check: {
      description:
        "Send an HTTP GET to the configured URL and record the result",
      arguments: z.object({}),
      // deno-lint-ignore no-explicit-any
      async execute(_args: Record<string, never>, context: any) {
        const { url, timeout } = context.globalArgs;
        const start = Date.now();
        let status = 0;
        let ok = false;

        try {
          const response = await fetch(url, {
            signal: AbortSignal.timeout(timeout),
          });
          status = response.status;
          ok = response.ok;
        } catch {
          // Connection refused, timeout, DNS failure — status stays 0
        }

        const latency = Date.now() - start;

        const result = { status, latency, ok };
        const handle = await context.writeResource("result", "result", result);

        return { dataHandles: [handle] };
      },
    },
  },
};
