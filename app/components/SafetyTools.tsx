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
      title: "Утверждённая система обработки персональных данных",
      text: "Обычный чат-бот по умолчанию не подходит. Сначала нужны законное основание, минимальный состав данных и проверка юриста и ИБ.",
      tag: "СТОП И ПРОВЕРКА",
    };
  }

  if (dataClass === "confidential" || location === "local" || priority === "control") {
    return {
      title: "Приватный или собственный контур",
      text: "Рассмотрите изолированное развёртывание или отдельно согласованное приватное облако. Контроль зависит от сети, доступа, журналов и резервных копий.",
      tag: "МАКСИМУМ КОНТРОЛЯ",
    };
  }

  if (location === "rf") {
    return {
      title: "Российское корпоративное облако",
      text: "Yandex AI Studio или корпоративный вариант GigaChat могут быть точкой старта, но журналирование, договор и допустимость данных проверяются отдельно.",
      tag: "ПОНЯТНЫЙ ПУТЬ ДЛЯ РФ",
    };
  }

  return {
    title: "Зарубежный корпоративный сервис после проверки",
    text: "Корпоративные OpenAI или Google дают сильную экосистему, но география доступа, хранение и трансграничная передача должны быть согласованы заранее.",
    tag: priority === "ecosystem" ? "ЭКОСИСТЕМА" : "ПРОСТОЙ ВХОД",
  };
}

export function SafetyTools() {
  const [dataClass, setDataClass] = useState<DataClass>("public");
  const [location, setLocation] = useState<"rf" | "global" | "local">("rf");
  const [priority, setPriority] = useState<"ease" | "ecosystem" | "control">("ease");
  const toolRecommendation = getToolRecommendation(location, dataClass, priority);

  return (
    <>
      <section className="safety-section scene" data-scene>
        <div className="section-heading">
          <p className="section-index">03 / БЕЗОПАСНЫЙ КОРИДОР</p>
          <h2>Сначала определите, что именно вы собираетесь передать.</h2>
        </div>
        <div className="safety-layout">
          <div className="classification-tabs" aria-label="Классы данных">
            {(Object.keys(DATA_CLASSIFICATION_GUIDANCE) as DataClass[]).map((key, index) => (
              <button
                key={key}
                type="button"
                aria-pressed={dataClass === key}
                onClick={() => setDataClass(key)}
                data-testid={`data-class-${key}`}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {DATA_CLASSIFICATION_GUIDANCE[key].label}
              </button>
            ))}
          </div>
          <div className="classification-result" aria-live="polite" aria-atomic="true">
            <p className="artifact-kicker">РЕШЕНИЕ</p>
            <h3>{DATA_CLASSIFICATION_GUIDANCE[dataClass].verdict}</h3>
            <p>{DATA_CLASSIFICATION_GUIDANCE[dataClass].recommendation}</p>
            <small>Материал не является юридической консультацией.</small>
          </div>
        </div>
      </section>

      <section className="tool-section scene" data-scene>
        <div className="section-heading">
          <p className="section-index">04 / КАРТА ВЫБОРА</p>
          <h2>Не «самая умная модель», а подходящий рабочий контур.</h2>
        </div>
        <div className="tool-selector">
          <label>
            <span>01 / Где вы работаете</span>
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value as typeof location)}
            >
              <option value="rf">Россия, нужен предсказуемый доступ</option>
              <option value="global">Международная компания</option>
              <option value="local">Нужен собственный контур</option>
            </select>
          </label>
          <label>
            <span>02 / Какие данные</span>
            <select
              value={dataClass}
              onChange={(event) => setDataClass(event.target.value as DataClass)}
            >
              <option value="public">Публичные</option>
              <option value="internal">Внутренние</option>
              <option value="confidential">Конфиденциальные</option>
              <option value="personal">Персональные</option>
            </select>
          </label>
          <label>
            <span>03 / Что важнее</span>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as typeof priority)}
            >
              <option value="ease">Простой вход</option>
              <option value="ecosystem">Работа в привычной экосистеме</option>
              <option value="control">Максимальный контроль</option>
            </select>
          </label>
          <div
            className="tool-result"
            aria-live="polite"
            aria-atomic="true"
            data-testid="tool-result"
          >
            <span>{toolRecommendation.tag}</span>
            <h3>{toolRecommendation.title}</h3>
            <p>{toolRecommendation.text}</p>
          </div>
        </div>
        <div className="tool-footnotes">
          <p>
            OpenAI и Google официально не указывают Россию в списках поддерживаемых стран и
            регионов.
          </p>
          <p>
            Российское происхождение сервиса само по себе не разрешает передавать персональные
            или конфиденциальные данные.
          </p>
          <p>
            Собственный запуск даёт контроль только при защищённой сети, доступах, журналах и
            резервных копиях.
          </p>
        </div>
      </section>
    </>
  );
}
