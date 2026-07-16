"use client";

import { SCENARIOS } from "../lib/content";
import { calculateSelectedHours, getSelectionGuidance } from "../lib/planner";
import { useExperience } from "./ExperienceShell";

const oneDecimal = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const compactNumber = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 1,
});

export function ScenarioLedger() {
  const { resetSelection, selected, toggleScenario } = useExperience();
  const totalHours = calculateSelectedHours(selected);
  const percentage = Math.min(100, (totalHours / 8) * 100);
  const selectionGuidance = getSelectionGuidance(selected.length);

  return (
    <section id="week" className="scenario-ledger scene" data-scene data-testid="scenario-ledger">
      <div className="section-heading">
        <p className="section-index">01 / КУДА УХОДИТ ВРЕМЯ</p>
        <h2 tabIndex={-1}>Соберите личный табель</h2>
        <p>Отметьте задачи, которые повторяются у вас каждую неделю.</p>
      </div>

      <div className="ledger-layout">
        <ul className="scenario-list" aria-label="Сценарии экономии времени">
          {SCENARIOS.map((scenario) => {
            const active = selected.includes(scenario.id);
            return (
              <li key={scenario.id}>
                <button
                  className="scenario-row"
                  type="button"
                  onClick={() => toggleScenario(scenario.id)}
                  aria-pressed={active}
                  data-testid={`scenario-${scenario.id}`}
                >
                  <span className="scenario-check" aria-hidden="true">
                    {active ? "×" : "+"}
                  </span>
                  <span className="scenario-number">{scenario.index}</span>
                  <span className="scenario-copy">
                    <strong>{scenario.title}</strong>
                    <small>{scenario.description}</small>
                  </span>
                  <span className="scenario-hours">{oneDecimal.format(scenario.estimate)} ч</span>
                </button>
              </li>
            );
          })}
        </ul>

        <aside className="time-result">
          <p className="artifact-kicker">ВАШ ОРИЕНТИР</p>
          <strong data-testid="hours-total">{compactNumber.format(totalHours)}</strong>
          <span>часов в неделю</span>
          <div className="time-meter" aria-hidden="true">
            <span style={{ width: `${percentage}%` }} />
          </div>
          <p>{selectionGuidance.summary}</p>
          <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {compactNumber.format(totalHours)} часов в неделю. {selectionGuidance.summary}
          </span>
          <button
            className="text-button"
            type="button"
            onClick={resetSelection}
            disabled={selected.length === 0}
          >
            Сбросить выбор
          </button>
        </aside>
      </div>
    </section>
  );
}
