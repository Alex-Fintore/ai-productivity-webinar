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
  assert.match(html, /До восьми часов из сорока — рабочий ориентир/);
  assert.match(html, /5 сценариев · до 8 часов в неделю · результат проверяет человек/);
  assert.match(html, /Выберите повторяющиеся задачи, поручите ИИ подготовить черновики/);
  assert.match(html, /Соберите личный табель/);
  assert.match(html, /Безопасный коридор/i);
  assert.match(html, /План на две недели/i);
  assert.match(html, /Открыть режим выступления/);
  assert.match(html, /До 8 часов — сценарная оценка, а не обещание результата/);
  assert.match(html, /КАК УСТРОЕН ПРОЦЕСС/);
  assert.match(html, /Первый вариант вместо работы с пустого листа/);
  assert.match(
    html,
    /Опишите задачу, материал и ограничения — черновик запроса обновится автоматически/,
  );
  assert.match(html, /ЧЕРНОВИК ЗАПРОСА/);
  assert.match(html, /Выберите 2–3 задачи — из них соберётся план на две недели/);
  assert.match(html, /Проверьте, стали ли выбранные задачи занимать меньше времени/);
  assert.match(html, /История, типы моделей, правовой минимум и источники/);
  assert.doesNotMatch(html, /40 часов → один свободный день/);
  assert.doesNotMatch(
    html,
    /финал проверяет человек|соберётся справа|экономит ли этот сценарий|экономит механику|улучшают повтор|масштабировать привычку/,
  );
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("renders all forty week cells and eight released-hour cells", async () => {
  const html = await (await render()).text();
  assert.equal((html.match(/class="hour-cell(?: free-hour)?"/g) ?? []).length, 40);
  assert.equal((html.match(/class="hour-cell free-hour"/g) ?? []).length, 8);
  assert.equal((html.match(/class="scenario-row"/g) ?? []).length, 5);
});

test("renders the visual controls with quiet, native accessibility semantics", async () => {
  const html = await (await render()).text();

  assert.match(html, /role="progressbar"/);
  assert.match(html, /aria-valuemin="1"/);
  assert.match(html, /aria-valuemax="8"/);
  assert.equal((html.match(/type="radio"/g) ?? []).length, 4);
  assert.equal((html.match(/aria-controls="classification-result"/g) ?? []).length, 4);
  assert.equal(
    (html.match(/class="hour-cell(?: free-hour)?"[^>]*aria-hidden="true"/g) ?? []).length,
    40,
  );
  assert.equal((html.match(/class="atlas-marker" aria-hidden="true"/g) ?? []).length, 4);
  assert.ok(html.indexOf("<header") < html.indexOf("<main"));
});
