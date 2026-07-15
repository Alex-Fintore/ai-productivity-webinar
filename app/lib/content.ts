import type { ScenarioId } from "./planner";

export type Scenario = {
  id: ScenarioId;
  index: string;
  title: string;
  shortTitle: string;
  estimate: number;
  description: string;
  delegate: string;
  humanCheck: string;
  promptLead: string;
};

export type SourceRecord = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  kind: "service" | "risk" | "law" | "local";
  volatile?: boolean;
};

export const SCENARIOS: Scenario[] = [
  {
    id: "mail",
    index: "01",
    title: "Письма и переписка",
    shortTitle: "Письма",
    estimate: 1.5,
    description:
      "Черновики ответов, краткая выжимка длинной переписки, напоминания и вежливые отказы.",
    delegate:
      "Суть входящего письма, первый вариант ответа и список фактов, которые нужно уточнить.",
    humanCheck:
      "Адресата, факты, сроки, обещания и то, не добавил ли помощник лишних обязательств.",
    promptLead: "Подготовь черновик делового ответа на письмо",
  },
  {
    id: "meetings",
    index: "02",
    title: "Встречи и поручения",
    shortTitle: "Встречи",
    estimate: 1.5,
    description:
      "Протокол, решения, открытые вопросы, ответственные и короткое письмо по итогам.",
    delegate:
      "Разбор заметок или расшифровки по структуре: решения, задачи, владелец, срок и риск.",
    humanCheck:
      "Не искажены ли договорённости, корректны ли ответственные и подтверждены ли сроки.",
    promptLead: "Собери рабочий протокол из заметок по встрече",
  },
  {
    id: "research",
    index: "03",
    title: "Поиск и анализ",
    shortTitle: "Поиск и анализ",
    estimate: 2,
    description:
      "Черновой обзор темы, сравнение вариантов и краткая записка для принятия решения.",
    delegate:
      "Первичную карту темы, три главных вывода, варианты, риски и список первоисточников.",
    humanCheck:
      "Открыть ключевые источники, проверить цифры, даты и отделить факты от предположений.",
    promptLead: "Подготовь короткую аналитическую записку по теме",
  },
  {
    id: "documents",
    index: "04",
    title: "Документы и презентации",
    shortTitle: "Документы",
    estimate: 1.5,
    description:
      "Структура, первый черновик, варианты формулировок и сжатие длинного материала.",
    delegate:
      "План документа, заголовки, тезисы, переходы и первую редакцию под конкретную аудиторию.",
    humanCheck:
      "Факты компании, тон, обязательные формулировки и соответствие реальной цели документа.",
    promptLead: "Собери структуру и первый черновик документа",
  },
  {
    id: "tables",
    index: "05",
    title: "Таблицы и отчёты",
    shortTitle: "Таблицы",
    estimate: 1.5,
    description:
      "Формулы, объяснение ошибок, первичный анализ, графики и комментарий к показателям.",
    delegate:
      "Подбор формул и сводных таблиц, поиск аномалий и черновое объяснение изменений.",
    humanCheck:
      "Качество исходных данных, логику расчёта и то, какие выводы пока делать рано.",
    promptLead: "Помоги разобрать таблицу и объяснить изменения показателей",
  },
];

export const SOURCES: SourceRecord[] = [
  {
    id: "nist-ai-rmf",
    title: "AI Risk Management Framework",
    publisher: "NIST",
    url: "https://www.nist.gov/itl/ai-risk-management-framework",
    kind: "risk",
  },
  {
    id: "openai-countries",
    title: "Supported countries and territories",
    publisher: "OpenAI",
    url: "https://help.openai.com/en/articles/5347006-openai-api-supported-countries-and-territories",
    kind: "service",
    volatile: true,
  },
  {
    id: "openai-api-data",
    title: "Data controls in the OpenAI API",
    publisher: "OpenAI",
    url: "https://developers.openai.com/api/docs/guides/your-data",
    kind: "service",
    volatile: true,
  },
  {
    id: "google-regions",
    title: "Available regions for the Gemini API and Google AI Studio",
    publisher: "Google",
    url: "https://ai.google.dev/gemini-api/docs/available-regions",
    kind: "service",
    volatile: true,
  },
  {
    id: "google-terms",
    title: "Gemini API Additional Terms of Service",
    publisher: "Google",
    url: "https://ai.google.dev/gemini-api/terms",
    kind: "service",
    volatile: true,
  },
  {
    id: "yandex-ai-studio",
    title: "Обзор Yandex AI Studio",
    publisher: "Yandex Cloud",
    url: "https://aistudio.yandex.ru/docs/ru/ai-studio/concepts/",
    kind: "service",
    volatile: true,
  },
  {
    id: "yandex-disable-logging",
    title: "Отключение логирования запросов",
    publisher: "Yandex Cloud",
    url: "https://aistudio.yandex.ru/docs/ru/ai-studio/operations/disable-logging.html",
    kind: "service",
    volatile: true,
  },
  {
    id: "gigachat-overview",
    title: "Справочник GigaChat REST API",
    publisher: "Сбер",
    url: "https://developers.sber.ru/docs/ru/gigachat/api/reference/rest/gigachat-api",
    kind: "service",
    volatile: true,
  },
  {
    id: "gigachat-corporate-terms",
    title: "Условия для корпоративных клиентов",
    publisher: "Сбер",
    url: "https://developers.sber.ru/docs/ru/policies/gigachat-agreement/corporate-clients-prepaid",
    kind: "service",
    volatile: true,
  },
  {
    id: "ollama",
    title: "Ollama Privacy",
    publisher: "Ollama",
    url: "https://ollama.com/privacy",
    kind: "local",
  },
  {
    id: "vllm",
    title: "OpenAI-compatible server",
    publisher: "vLLM",
    url: "https://docs.vllm.ai/en/latest/serving/online_serving/openai_compatible_server/",
    kind: "local",
  },
  {
    id: "personal-data-law",
    title: "152-ФЗ о персональных данных",
    publisher: "Президент России",
    url: "https://www.kremlin.ru/acts/bank/24154",
    kind: "law",
  },
  {
    id: "localization-law",
    title: "Поправки о локализации персональных данных",
    publisher: "Президент России",
    url: "https://www.kremlin.ru/acts/bank/51683",
    kind: "law",
  },
  {
    id: "cross-border-law",
    title: "Поправки о трансграничной передаче данных",
    publisher: "Президент России",
    url: "https://www.kremlin.ru/acts/bank/48190",
    kind: "law",
  },
];

export const HISTORY = [
  ["1943", "Первая математическая модель нейронной сети"],
  ["1958", "Перцептрон превращает идею обучения в рабочую схему"],
  ["2012", "Глубокие сети дают заметный скачок в распознавании изображений"],
  ["2017", "Архитектура Transformer меняет работу с языком"],
  ["2022", "Разговорные помощники становятся массовым инструментом"],
  ["2026", "Фокус смещается от ответов к управляемым рабочим процессам"],
] as const;

export const ARCHITECTURES = [
  ["Трансформеры", "Текст, код, поиск по документам и универсальные помощники"],
  ["Свёрточные сети", "Изображения, контроль качества и встроенное зрение"],
  ["Графовые сети", "Антифрод, рекомендации и данные, где важны связи"],
  ["Диффузионные модели", "Создание изображений, видео и части аудиосценариев"],
  ["Мультимодальные модели", "Единая работа с текстом, изображениями, аудио и файлами"],
] as const;
