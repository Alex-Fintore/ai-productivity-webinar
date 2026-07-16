import { ExperienceShell } from "./components/ExperienceShell";
import { PilotPlan } from "./components/PilotPlan";
import { PromptBuilder } from "./components/PromptBuilder";
import { SafetyTools } from "./components/SafetyTools";
import { ScenarioLedger } from "./components/ScenarioLedger";
import { ARCHITECTURES, HISTORY, SOURCES } from "./lib/content";

export default function Home() {
  return (
    <ExperienceShell>
      <section id="top" className="hero-story scene" data-scene data-testid="hero-scene">
        <div className="hero-copy">
          <p className="eyebrow">
            5 сценариев · до 8 часов в неделю · результат проверяет человек
          </p>
          <h1 tabIndex={-1}>
            Верните себе
            <em>рабочий день</em>
          </h1>
          <p className="hero-lead">
            Выберите повторяющиеся задачи, поручите ИИ подготовить черновики и за две недели
            сравните время до и после. Факты, решения и финальная проверка остаются за человеком.
          </p>
          <a className="primary-cta" href="#week">
            Собрать свою неделю <span aria-hidden="true">→</span>
          </a>
          <p className="fine-print">До 8 часов — сценарная оценка, а не обещание результата.</p>
        </div>

        <div className="hero-artifact" aria-labelledby="week-grid-title">
          <div className="artifact-heading">
            <div>
              <p className="artifact-kicker">АРТЕФАКТ 01 / РАБОЧАЯ НЕДЕЛЯ</p>
              <h2 id="week-grid-title">До восьми часов из сорока — рабочий ориентир</h2>
            </div>
            <p>5 дней × 8 часов</p>
          </div>
          <div className="week-grid-shell">
            <div className="day-labels" aria-hidden="true">
              {["ПН", "ВТ", "СР", "ЧТ", "ПТ"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div
              className="week-grid"
              role="img"
              aria-label="Сетка из сорока рабочих часов; восемь часов пятницы выделены как потенциально освобождённое время"
              aria-describedby="week-grid-summary"
            >
              {Array.from({ length: 40 }, (_, index) => (
                <span
                  key={index}
                  className={index >= 32 ? "hour-cell free-hour" : "hour-cell"}
                  data-hour={String(index + 1).padStart(2, "0")}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
          <p id="week-grid-summary" className="sr-only">
            Каждый день содержит восемь рабочих часов. Восемь часов пятницы показаны как
            потенциально освобождённое время, а не гарантированный результат.
          </p>
          <table className="sr-only">
            <caption>Табличный эквивалент сорокачасовой рабочей недели</caption>
            <thead>
              <tr>
                <th scope="col">День</th>
                <th scope="col">Рабочих часов</th>
                <th scope="col">Потенциально освобождается</th>
              </tr>
            </thead>
            <tbody>
              {["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"].map(
                (day, index) => (
                  <tr key={day}>
                    <th scope="row">{day}</th>
                    <td>8</td>
                    <td>{index === 4 ? 8 : 0}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
          <div className="artifact-note reveal-rule">
            Восемь выделенных блоков — верхняя граница оценки для пяти сценариев. Реальный
            результат зависит от задач, исходных материалов и качества проверки.
          </div>
        </div>
      </section>

      <ScenarioLedger />

      <section id="process" className="process-section scene" data-scene>
        <div className="section-heading section-heading--wide light-heading">
          <p className="section-index">02 / КАК УСТРОЕН ПРОЦЕСС</p>
          <h2 tabIndex={-1}>Помощник делает черновик. Человек отвечает за результат.</h2>
        </div>
        <ol className="process-track">
          {[
            ["01", "Сырой материал", "Письмо, запись встречи, документ или таблица"],
            ["02", "Чёткая задача", "Контекст, ограничения и ожидаемый формат"],
            ["03", "Черновик ИИ", "Первый вариант вместо работы с пустого листа"],
            ["04", "Проверка человеком", "Факты, числа, сроки, тон и чувствительные данные"],
            ["05", "Уточнённый шаблон", "Запишите ошибки, поправьте запрос и попробуйте снова"],
          ].map(([index, title, text]) => (
            <li key={index}>
              <span>{index}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <SafetyTools />
      <PromptBuilder />
      <PilotPlan />

      <section id="atlas" className="atlas-section scene" data-scene>
        <div className="section-heading section-heading--wide">
          <p className="section-index">07 / АТЛАС</p>
          <h2 tabIndex={-1}>
            История, типы моделей, правовой минимум и источники — в разделах ниже.
          </h2>
        </div>
        <div className="atlas-details">
          <details>
            <summary>
              <span>01</span>
              <span>Как мы пришли к рабочим помощникам</span>
              <span className="atlas-marker" aria-hidden="true">+</span>
            </summary>
            <ol className="history-list">
              {HISTORY.map(([year, text]) => (
                <li key={year}>
                  <strong>{year}</strong>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </details>
          <details>
            <summary>
              <span>02</span>
              <span>Какие типы нейросетей существуют</span>
              <span className="atlas-marker" aria-hidden="true">+</span>
            </summary>
            <dl className="architecture-list">
              {ARCHITECTURES.map(([name, text]) => (
                <div key={name}>
                  <dt>{name}</dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>
          </details>
          <details>
            <summary>
              <span>03</span>
              <span>Правовой минимум для России</span>
              <span className="atlas-marker" aria-hidden="true">+</span>
            </summary>
            <div className="legal-copy">
              <p>
                Материал не является юридической консультацией. Для персональных данных нужны
                законная цель, минимальный состав и разрешённый контур. Зарубежный сервис требует
                отдельной проверки локализации и трансграничной передачи.
              </p>
              <p>
                ГК РФ признаёт автором гражданина, творческим трудом которого создан результат
                интеллектуальной деятельности. Поэтому нейросеть нельзя автоматически считать
                автором. Статус конкретного результата зависит от творческого вклада человека,
                исходных материалов, договора и прав третьих лиц.
              </p>
              <p>
                Коммерческая тайна возникает не автоматически, а после введения компанией
                соответствующего режима доступа, учёта и маркировки.
              </p>
              <div className="legal-links">
                <a href="https://www.kremlin.ru/acts/bank/24154" target="_blank" rel="noreferrer">
                  152-ФЗ о персональных данных ↗
                </a>
                <a href="https://www.kremlin.ru/acts/bank/51683" target="_blank" rel="noreferrer">
                  Поправки о локализации данных ↗
                </a>
                <a href="https://www.kremlin.ru/acts/bank/48190" target="_blank" rel="noreferrer">
                  Поправки о трансграничной передаче ↗
                </a>
                <a href="https://www.kremlin.ru/acts/bank/24743" target="_blank" rel="noreferrer">
                  ГК РФ, часть четвёртая ↗
                </a>
                <a href="https://www.kremlin.ru/acts/bank/21227" target="_blank" rel="noreferrer">
                  98-ФЗ о коммерческой тайне ↗
                </a>
              </div>
            </div>
          </details>
          <details>
            <summary>
              <span>04</span>
              <span>Проверяемые первоисточники</span>
              <span className="atlas-marker" aria-hidden="true">+</span>
            </summary>
            <div className="source-list">
              {SOURCES.map((source) => (
                <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
                  <span>{source.publisher}</span>
                  <strong>{source.title}</strong>
                  <small>
                    {source.volatile
                      ? "Данные могут меняться — проверено 15.07.2026"
                      : "Официальный источник"}
                  </small>
                </a>
              ))}
            </div>
          </details>
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <p className="artifact-kicker">ГЛАВНАЯ МЫСЛЬ</p>
          <strong>Начните не с модели. Начните с одной повторяющейся задачи.</strong>
        </div>
        <div>
          <span>Авторская методика и сценарная оценка</span>
          <span>Alex Fintore · 2026</span>
        </div>
      </footer>
    </ExperienceShell>
  );
}
