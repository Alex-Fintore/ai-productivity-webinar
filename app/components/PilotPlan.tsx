"use client";

import { useMemo } from "react";
import { SCENARIOS } from "../lib/content";
import { buildPilotPlan, getSelectionGuidance } from "../lib/planner";
import { useExperience } from "./ExperienceShell";
import { useCopyFeedback } from "./useCopyFeedback";

export function PilotPlan() {
  const { selected } = useExperience();
  const { copy, status } = useCopyFeedback();
  const selectionGuidance = getSelectionGuidance(selected.length);
  const pilotPlan = useMemo(() => {
    try {
      return buildPilotPlan(selected);
    } catch {
      return [];
    }
  }, [selected]);
  const planText = pilotPlan
    .map((entry) => `День ${entry.day}. ${entry.title}\n${entry.detail}`)
    .join("\n\n");
  const copyLabel =
    status === "pending"
      ? "Копирую…"
      : status === "success"
      ? "План скопирован"
      : status === "error"
        ? "Попробовать ещё раз"
        : "Копировать план";

  return (
    <section id="pilot" className="pilot-section scene" data-scene data-testid="pilot-section">
      <div className="section-heading">
        <p className="section-index">06 / ПЛАН НА ДВЕ НЕДЕЛИ</p>
        <h2 tabIndex={-1}>Проверьте, стали ли выбранные задачи занимать меньше времени.</h2>
        <p>Для рабочего плана выберите в табеле две или три задачи.</p>
      </div>

      {pilotPlan.length > 0 ? (
        <>
          <div className="pilot-toolbar">
            <p>
              {selected
                .map((id) => SCENARIOS.find((scenario) => scenario.id === id)?.shortTitle)
                .join(" · ")}
            </p>
            <button
              type="button"
              onClick={() => void copy(planText)}
              data-testid="copy-plan"
              data-copy-state={status}
              aria-busy={status === "pending"}
              aria-disabled={status === "pending"}
            >
              {copyLabel}
            </button>
            <button type="button" onClick={() => window.print()}>
              Распечатать
            </button>
            <span className="sr-only" role="status" aria-live="polite">
              {status === "pending"
                ? "Копирую план."
                : status === "success"
                  ? "План скопирован в буфер обмена."
                  : status === "error"
                    ? "Не удалось скопировать план. Попробуйте ещё раз."
                    : ""}
            </span>
          </div>
          <ol className="pilot-grid">
            {pilotPlan.map((entry) => (
              <li key={entry.day} data-phase={entry.phase}>
                <span>ДЕНЬ {String(entry.day).padStart(2, "0")}</span>
                <strong>{entry.title}</strong>
                <p>{entry.detail}</p>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <div className="pilot-empty" role="status">
          <strong>{selectionGuidance.title}</strong>
          <p>{selectionGuidance.detail}</p>
          <a href="#week">Вернуться к выбору ↑</a>
        </div>
      )}
    </section>
  );
}
