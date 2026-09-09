import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import worker from "../worker/index.js";

test("serves existing static assets", async () => {
  const response = await worker.fetch(new Request("https://example.test/assets/pages/page-01.jpg"), {
    ASSETS: {
      fetch: async () => new Response("asset", { status: 200 }),
    },
  });

  assert.equal(response.status, 200);
});

test("falls back to the portfolio page for browser routes", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/portfolio", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const pathname = new URL(request.url).pathname;
          calls.push(pathname);
          return new Response(pathname === "/index.html" ? "portfolio" : "missing", {
            status: pathname === "/index.html" ? 200 : 404,
          });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/portfolio", "/index.html"]);
});

test("build emits the files required by Sites", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/client/assets/pages/page-01.jpg", import.meta.url));
  await access(new URL("../dist/client/resume/index.html", import.meta.url));
  await access(new URL("../dist/client/resume/assets/pages/page-01.jpg", import.meta.url));
  await access(new URL("../dist/client/resume/assets/pdf/visual-designer-resume.pdf", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));
});
