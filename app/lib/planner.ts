export const SCENARIO_ESTIMATES = {
  mail: 1.5,
  meetings: 1.5,
  research: 2,
  documents: 1.5,
  tables: 1.5,
} as const;

export type ScenarioId = keyof typeof SCENARIO_ESTIMATES;

export type DataClass = "public" | "internal" | "confidential" | "personal";

export type DataGuidance = {
  label: string;
  verdict: string;
  recommendation: string;
};

export type PilotDay = {
  day: number;
  phase: "baseline" | "template" | "trial" | "review" | "comparison";
  title: string;
  detail: string;
};

export type SelectionGuidance = {
  summary: string;
  title: string;
  detail: string;
};

export const DATA_CLASSIFICATION_GUIDANCE: Record<DataClass, DataGuidance> = {
  public: {
    label: "Публичные данные",
    verdict: "Можно использовать в разрешённом сервисе",
    recommendation:
      "Даже по открытым данным модель может ошибиться. Перед публикацией проверьте факты и источники.",
  },
  internal: {
    label: "Внутренние данные",
    verdict: "Только в сервисе, который разрешила компания",
    recommendation:
      "Передавайте только то, что нужно для задачи, и только в сервис, который разрешила компания.",
  },
  confidential: {
    label: "Конфиденциальные данные",
    verdict: "Не загружайте в обычный внешний чат",
    recommendation:
      "Используйте только систему, которую компания разрешила для таких данных. Нужны контроль доступа и согласие владельца данных.",
  },
  personal: {
    label: "Персональные данные",
    verdict: "Сначала согласуйте с юристом и специалистом по безопасности",
    recommendation:
      "Не передавайте ФИО, контакты, документы и идентификаторы без понятной цели, законного основания и разрешения компании.",
  },
};

const SCENARIO_LABELS: Record<ScenarioId, string> = {
  mail: "письма",
  meetings: "встречи",
  research: "поиск и анализ",
  documents: "документы",
  tables: "таблицы",
};

export function getSelectionGuidance(count: number): SelectionGuidance {
  if (count <= 0) {
    return {
      summary: "Выберите 2–3 задачи — из них соберётся план на две недели.",
      title: "Выберите 2–3 задачи",
      detail:
        "Вернитесь к списку и отметьте задачи, которые хотите проверить в первую очередь.",
    };
  }

  if (count === 1) {
    return {
      summary: "Выберите ещё одну задачу — после этого появится план.",
      title: "Выберите ещё одну задачу",
      detail: "После этого появится план на две недели.",
    };
  }

  if (count >= 4) {
    return {
      summary: "Оставьте 2–3 задачи, чтобы план был выполним за две недели.",
      title: "Оставьте три главные задачи",
      detail: "План рассчитан на 2–3 задачи, которые можно проверить за две недели.",
    };
  }

  return {
    summary:
      count === 2
        ? "Выбраны две задачи — план на две недели готов."
        : "Выбраны три задачи — план на две недели готов.",
    title: "План готов",
    detail: "Начните с замера исходного времени и сохраните результат для сравнения.",
  };
}

function isScenarioId(value: unknown): value is ScenarioId {
  return typeof value === "string" && value in SCENARIO_ESTIMATES;
}

function uniqueValidScenarioIds(values: unknown[]): ScenarioId[] {
  return [...new Set(values.filter(isScenarioId))];
}

export function calculateSelectedHours(ids: unknown[]): number {
  if (!Array.isArray(ids)) {
    throw new TypeError("Список сценариев должен быть массивом");
  }

  const total = uniqueValidScenarioIds(ids).reduce(
    (sum, id) => sum + SCENARIO_ESTIMATES[id],
    0,
  );

  return Math.min(8, total);
}

export function buildPilotPlan(ids: unknown[]): PilotDay[] {
  if (!Array.isArray(ids)) {
    throw new TypeError("Список сценариев должен быть массивом");
  }

  const scenarios = uniqueValidScenarioIds(ids);
  const hasOnlyValidValues = ids.every(isScenarioId);
  if (!hasOnlyValidValues || scenarios.length < 2 || scenarios.length > 3) {
    throw new RangeError("Для плана выберите два или три разных сценария");
  }

  const scenarioLabels = scenarios.map((id) => SCENARIO_LABELS[id]);
  const scenarioText = scenarioLabels.join(", ");
  const scenarioChoiceText =
    scenarioLabels.length === 2
      ? scenarioLabels.join(" или ")
      : `${scenarioLabels.slice(0, -1).join(", ")} или ${scenarioLabels.at(-1)}`;
  const entries: Omit<PilotDay, "day">[] = [
    {
      phase: "baseline",
      title: "Замерьте исходное время",
      detail: `Зафиксируйте, сколько времени сейчас занимают: ${scenarioText}. Ничего пока не меняйте.`,
    },
    {
      phase: "baseline",
      title: "Соберите примеры",
      detail: "Выберите по два обычных примера каждой задачи и запишите критерии хорошего результата.",
    },
    {
      phase: "template",
      title: "Соберите первый шаблон",
      detail: `Сделайте отдельный запрос для каждой выбранной задачи: ${scenarioText}. Укажите контекст, ограничения и формат ответа.`,
    },
    {
      phase: "template",
      title: "Добавьте проверку человеком",
      detail: "Составьте короткий список: факты, адресаты, сроки, числа и данные, которые нельзя пропускать.",
    },
    {
      phase: "trial",
      title: "Проведите первую пробу",
      detail: "Выполните одну реальную задачу с шаблоном, но не отправляйте результат без проверки.",
    },
    {
      phase: "review",
      title: "Запишите ошибки",
      detail: "Отметьте, что пришлось переписать, какие факты модель добавила и где не хватило контекста.",
    },
    {
      phase: "template",
      title: "Уточните шаблон",
      detail: "Добавьте в запрос найденные ограничения и один хороший пример результата.",
    },
    {
      phase: "trial",
      title: "Повторите пробу",
      detail: `Возьмите новый пример одной из выбранных задач — ${scenarioChoiceText} — и проверьте обновлённый шаблон.`,
    },
    {
      phase: "trial",
      title: "Проверьте повторяемость",
      detail: "Сделайте ещё одну задачу без изменения шаблона и сравните объём ручной правки.",
    },
    {
      phase: "review",
      title: "Проверьте безопасность",
      detail: "Убедитесь, что выбранный сервис и тип данных соответствуют правилам компании.",
    },
    {
      phase: "trial",
      title: "Проведите рабочий день",
      detail: "Используйте шаблоны во всех подходящих задачах дня и запишите фактическую экономию времени.",
    },
    {
      phase: "review",
      title: "Соберите журнал правок",
      detail: "Сгруппируйте ошибки по типам: факты, тон, формат, лишние обещания и чувствительные данные.",
    },
    {
      phase: "review",
      title: "Закрепите рабочую версию",
      detail: "Оставьте только те шаблоны, которые стабильно проходят вашу проверку качества.",
    },
    {
      phase: "comparison",
      title: "Сравните итог",
      detail: "Сравните время до и после, число серьёзных ошибок и объём ручной правки. Решите, какие шаблоны оставить, а какие проверить ещё раз.",
    },
  ];

  return entries.map((entry, index) => ({ day: index + 1, ...entry }));
}
