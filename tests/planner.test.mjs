import assert from "node:assert/strict";
import test from "node:test";

import {
  DATA_CLASSIFICATION_GUIDANCE,
  SCENARIO_ESTIMATES,
  buildPilotPlan,
  calculateSelectedHours,
} from "../app/lib/planner.ts";

const ALL_SCENARIO_IDS = [
  "mail",
  "meetings",
  "research",
  "documents",
  "tables",
];

test("publishes the five research-backed weekly estimates", () => {
  assert.deepEqual(SCENARIO_ESTIMATES, {
    mail: 1.5,
    meetings: 1.5,
    research: 2,
    documents: 1.5,
    tables: 1.5,
  });
});

test("calculates selected time safely, once per known scenario, with an eight-hour ceiling", () => {
  assert.equal(calculateSelectedHours(["mail", "research"]), 3.5);
  assert.equal(
    calculateSelectedHours(["mail", "mail", "research", "research"]),
    3.5,
  );
  assert.equal(
    calculateSelectedHours([...ALL_SCENARIO_IDS, ...ALL_SCENARIO_IDS]),
    8,
  );

  assert.equal(
    calculateSelectedHours(["mail", "unknown", null, 42, {}, undefined]),
    1.5,
  );

  for (const invalidInput of [undefined, null, "mail", {}]) {
    assert.throws(
      () => calculateSelectedHours(invalidInput),
      TypeError,
      "the collection itself must be an array",
    );
  }
});

test("builds an ordered 14-day pilot from two or three unique scenarios", () => {
  const plan = buildPilotPlan(["mail", "research", "mail"]);
  const threeScenarioPlan = buildPilotPlan(["mail", "research", "tables"]);

  assert.ok(Array.isArray(plan), "the plan should be a list of day records");
  assert.equal(plan.length, 14);
  assert.equal(threeScenarioPlan.length, 14);
  assert.deepEqual(
    plan.map((entry) => entry.day),
    Array.from({ length: 14 }, (_, index) => index + 1),
  );

  const dayText = plan.map((entry) => JSON.stringify(entry));
  const fullPlanText = dayText.join("\n");

  assert.match(fullPlanText, /замер|исходн|baseline/i);
  assert.match(fullPlanText, /шаблон|template/i);
  assert.ok(
    dayText.filter((entry) => /проб|тест|trial|повтор/i.test(entry)).length >= 2,
    "the pilot should contain repeated trials on separate days",
  );
  assert.match(fullPlanText, /ошиб|error/i);
  assert.match(dayText.at(-1), /сравн|итог|comparison|final/i);
  assert.match(fullPlanText, /mail|письм/i);
  assert.match(fullPlanText, /research|поиск|анализ/i);
});

test("rejects pilot selections outside the two-to-three valid-scenario boundary", () => {
  for (const invalidSelection of [
    ["mail"],
    ["mail", "meetings", "research", "documents"],
    ["mail", "unknown"],
    ["mail", "mail"],
  ]) {
    assert.throws(() => buildPilotPlan(invalidSelection));
  }

  for (const invalidInput of [undefined, null, "mail", {}]) {
    assert.throws(() => buildPilotPlan(invalidInput), TypeError);
  }
});

test("provides distinct guidance for every data classification", () => {
  assert.deepEqual(Object.keys(DATA_CLASSIFICATION_GUIDANCE).sort(), [
    "confidential",
    "internal",
    "personal",
    "public",
  ]);

  const guidanceTexts = Object.values(DATA_CLASSIFICATION_GUIDANCE).map(
    (entry) =>
      typeof entry === "string"
        ? entry.trim()
        : Object.values(entry).join(" ").trim(),
  );

  for (const guidance of guidanceTexts) {
    assert.ok(guidance.length > 0, "each classification needs user-facing guidance");
  }
  assert.equal(new Set(guidanceTexts).size, 4);
});
