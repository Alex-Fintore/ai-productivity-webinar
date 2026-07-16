"use client";

import { useState } from "react";
import { SCENARIOS, type Scenario } from "../lib/content";
import type { ScenarioId } from "../lib/planner";
import { useCopyFeedback } from "./useCopyFeedback";

function buildPrompt(
  scenario: Scenario,
  role: string,
  context: string,
  goal: string,
  constraints: string,
) {
  return `${scenario.promptLead}.

Моя роль: ${role || "[укажите вашу роль]"}
Контекст: ${context || "[добавьте исходную ситуацию или материал]"}
Цель: ${goal || "[укажите, какой результат вам нужен]"}
Ограничения: ${constraints || "не добавляй фактов от себя; помечай неоднозначности как [ПРОВЕРИТЬ]"}

Верни результат в трёх частях:
1. Короткое резюме.
2. Рабочий черновик.
3. Список фактов, чисел и решений, которые человек должен проверить.`;
}

export function PromptBuilder() {
  const [promptScenario, setPromptScenario] = useState<ScenarioId>("mail");
  const [role, setRole] = useState("");
  const [context, setContext] = useState("");
  const [goal, setGoal] = useState("");
  const [constraints, setConstraints] = useState("");
  const { copy, status } = useCopyFeedback();
  const activeScenario =
    SCENARIOS.find((scenario) => scenario.id === promptScenario) ?? SCENARIOS[0];
  const promptText = buildPrompt(activeScenario, role, context, goal, constraints);
  const copyLabel =
    status === "pending"
      ? "Копирую…"
      : status === "success"
      ? "Запрос скопирован"
      : status === "error"
        ? "Попробовать ещё раз"
        : "Скопировать запрос";

  return (
    <section id="prompt" className="prompt-section scene" data-scene>
      <div className="section-heading section-heading--wide light-heading">
        <p className="section-index">05 / КОНСТРУКТОР ЗАПРОСОВ</p>
        <h2 tabIndex={-1}>
          Опишите задачу, материал и ограничения — черновик запроса обновится автоматически.
        </h2>
      </div>
      <div className="prompt-workbench">
        <form className="prompt-form" onSubmit={(event) => event.preventDefault()}>
          <label>
            <span>Сценарий</span>
            <select
              value={promptScenario}
              onChange={(event) => setPromptScenario(event.target.value as ScenarioId)}
            >
              {SCENARIOS.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Ваша роль</span>
            <input
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="Например: руководитель отдела продаж"
              autoComplete="organization-title"
            />
          </label>
          <label>
            <span>Контекст</span>
            <textarea
              value={context}
              onChange={(event) => setContext(event.target.value)}
              placeholder="Что произошло и какой материал у вас есть"
              rows={3}
            />
          </label>
          <label>
            <span>Цель</span>
            <input
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder="Какой результат нужен"
            />
          </label>
          <label>
            <span>Ограничения</span>
            <textarea
              value={constraints}
              onChange={(event) => setConstraints(event.target.value)}
              placeholder="Что нельзя обещать, добавлять или упускать"
              rows={3}
            />
          </label>
        </form>
        <div className="prompt-output">
          <div className="prompt-output-head">
            <span>ЧЕРНОВИК ЗАПРОСА</span>
            <button
              type="button"
              onClick={() => void copy(promptText)}
              data-testid="copy-prompt"
              data-copy-state={status}
              aria-busy={status === "pending"}
              aria-disabled={status === "pending"}
            >
              {copyLabel}
            </button>
          </div>
          <span className="sr-only" role="status" aria-live="polite">
            {status === "pending"
              ? "Копирую запрос."
              : status === "success"
                ? "Запрос скопирован в буфер обмена."
                : status === "error"
                  ? "Не удалось скопировать запрос. Попробуйте ещё раз."
                  : ""}
          </span>
          <pre>{promptText}</pre>
          <p>
            Перед использованием проверьте факты, числа, адресатов, сроки и допустимость исходных
            данных.
          </p>
        </div>
      </div>
    </section>
  );
}
