"use client";

import { useState } from "react";
import {
  DATA_CLASSIFICATION_GUIDANCE,
  type DataClass,
} from "../lib/planner";

function getToolRecommendation(
  location: "rf" | "global" | "local",
  dataClass: DataClass,
  priority: "ease" | "ecosystem" | "control",
) {
  if (dataClass === "personal") {
    return {
      title: "Сервис, который компания разрешила для персональных данных",
      text: "Обычный чат-бот не подходит. Сначала определите законное основание, оставьте только необходимые данные и согласуйте сервис с юристом и ИБ.",
      tag: "СНАЧАЛА СОГЛАСУЙТЕ",
    };
  }

  if (dataClass === "confidential" || location === "local" || priority === "control") {
    return {
      title: "Собственная система или согласованное приватное облако",
      text: "Рассмотрите систему в инфраструктуре компании или отдельно согласованное приватное облако. Безопасность зависит от сети, доступа, журналов действий и резервных копий.",
      tag: "БОЛЬШЕ КОНТРОЛЯ",
    };
  }

  if (location === "rf") {
    return {
      title: "Российское корпоративное облако",
      text: "Yandex AI Studio или корпоративный вариант GigaChat могут быть точкой старта. Перед работой проверьте договор, условия хранения и какие данные разрешает загружать компания.",
      tag: "ДОСТУП В РОССИИ",
    };
  }

  return {
    title: "Зарубежный корпоративный сервис после проверки",
    text: "Корпоративные версии OpenAI или Google могут подойти международной команде. Заранее проверьте доступность в нужных странах, условия хранения данных и правила трансграничной передачи.",
    tag: priority === "ecosystem" ? "ПРИВЫЧНЫЕ ИНСТРУМЕНТЫ" : "ПОСЛЕ ПРОВЕРКИ",
  };
}

export function SafetyTools() {
  const [dataClass, setDataClass] = useState<DataClass>("public");
  const [location, setLocation] = useState<"rf" | "global" | "local">("rf");
  const [priority, setPriority] = useState<"ease" | "ecosystem" | "control">("ease");
  const [announcement, setAnnouncement] = useState("");
  const toolRecommendation = getToolRecommendation(location, dataClass, priority);

  const announceToolRecommendation = (
    nextLocation: typeof location,
    nextDataClass: DataClass,
    nextPriority: typeof priority,
  ) => {
    setAnnouncement(
      `Рекомендация по сервису: ${getToolRecommendation(nextLocation, nextDataClass, nextPriority).title}`,
    );
  };

  return (
    <>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
      <section id="safety" className="safety-section scene" data-scene>
        <div className="section-heading section-heading--wide">
          <p className="section-index">03 / БЕЗОПАСНЫЙ КОРИДОР</p>
          <h2 tabIndex={-1}>Сначала определите, что именно вы собираетесь передать.</h2>
        </div>
        <div className="safety-layout">
          <fieldset className="classification-tabs">
            <legend className="sr-only">Классы данных</legend>
            {(Object.keys(DATA_CLASSIFICATION_GUIDANCE) as DataClass[]).map((key, index) => (
              <div className="classification-option" key={key}>
                <input
                  id={`data-class-${key}`}
                  name="data-classification"
                  type="radio"
                  value={key}
                  checked={dataClass === key}
                  onChange={() => {
                    setDataClass(key);
                    setAnnouncement(
                      `Безопасный коридор: ${DATA_CLASSIFICATION_GUIDANCE[key].verdict}`,
                    );
                  }}
                  aria-controls="classification-result"
                  data-testid={`data-class-${key}`}
                />
                <label htmlFor={`data-class-${key}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{DATA_CLASSIFICATION_GUIDANCE[key].label}</span>
                </label>
              </div>
            ))}
          </fieldset>
          <div
            id="classification-result"
            className="classification-result"
          >
            <p className="artifact-kicker">РЕШЕНИЕ</p>
            <h3>{DATA_CLASSIFICATION_GUIDANCE[dataClass].verdict}</h3>
            <p>{DATA_CLASSIFICATION_GUIDANCE[dataClass].recommendation}</p>
            <small>Материал не является юридической консультацией.</small>
          </div>
        </div>
      </section>

      <section id="tools" className="tool-section scene" data-scene>
        <div className="section-heading section-heading--wide">
          <p className="section-index">04 / КАРТА ВЫБОРА</p>
          <h2 tabIndex={-1}>
            Выберите сервис по типу данных, правилам компании и доступности.
          </h2>
        </div>
        <div className="tool-selector">
          <label>
            <span>01 / Где должен работать сервис</span>
            <select
              value={location}
              onChange={(event) => {
                const nextLocation = event.target.value as typeof location;
                setLocation(nextLocation);
                announceToolRecommendation(nextLocation, dataClass, priority);
              }}
              aria-controls="tool-result"
            >
              <option value="rf">С доступом из России</option>
              <option value="global">Для международной команды</option>
              <option value="local">Только внутри инфраструктуры компании</option>
            </select>
          </label>
          <label>
            <span>02 / Какие данные вы будете передавать</span>
            <select
              value={dataClass}
              onChange={(event) => {
                const nextDataClass = event.target.value as DataClass;
                setDataClass(nextDataClass);
                announceToolRecommendation(location, nextDataClass, priority);
              }}
              aria-controls="tool-result"
            >
              <option value="public">Публичные</option>
              <option value="internal">Внутренние</option>
              <option value="confidential">Конфиденциальные</option>
              <option value="personal">Персональные</option>
            </select>
          </label>
          <label>
            <span>03 / Что для вас важнее</span>
            <select
              value={priority}
              onChange={(event) => {
                const nextPriority = event.target.value as typeof priority;
                setPriority(nextPriority);
                announceToolRecommendation(location, dataClass, nextPriority);
              }}
              aria-controls="tool-result"
            >
              <option value="ease">Начать без сложной настройки</option>
              <option value="ecosystem">Работа в привычной экосистеме</option>
              <option value="control">Максимальный контроль</option>
            </select>
          </label>
          <div
            id="tool-result"
            className="tool-result"
            data-testid="tool-result"
          >
            <span>{toolRecommendation.tag}</span>
            <h3>{toolRecommendation.title}</h3>
            <p>{toolRecommendation.text}</p>
          </div>
        </div>
        <div className="tool-footnotes">
          <p>
            В официальных списках доступности OpenAI API и Google AI Studio Россия не указана.
          </p>
          <p>
            Российское происхождение сервиса само по себе не разрешает передавать персональные
            или конфиденциальные данные.
          </p>
          <p>
            Сам по себе локальный запуск не защищает данные: всё зависит от сети, прав доступа,
            журналов действий и резервных копий.
          </p>
        </div>
      </section>
    </>
  );
}
