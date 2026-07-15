import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the interactive story without starter residue", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="ru">/i);
  assert.match(html, /<title>Верните себе рабочий день<\/title>/i);
  assert.match(html, /40 часов → один свободный день/);
  assert.match(html, /Соберите личный табель/);
  assert.match(html, /Безопасный коридор/i);
  assert.match(html, /План на две недели/i);
  assert.match(html, /Режим выступления/);
  assert.match(html, /До 8 часов — сценарная оценка, а не обещание результата/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("renders all forty week cells and eight released-hour cells", async () => {
  const html = await (await render()).text();
  assert.equal((html.match(/class="hour-cell(?: free-hour)?"/g) ?? []).length, 40);
  assert.equal((html.match(/class="hour-cell free-hour"/g) ?? []).length, 8);
  assert.equal((html.match(/class="scenario-row"/g) ?? []).length, 5);
});
