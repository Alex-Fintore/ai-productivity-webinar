"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { SCENARIOS } from "../lib/content";
import type { ScenarioId } from "../lib/planner";

gsap.registerPlugin(ScrollTrigger);

const STORAGE_KEY = "ai-productivity-plan-v1";
const PRESENTATION_EVENT = "ai-productivity:presentation-change";
const SCENE_COUNT = 8;
const interactiveSelector =
  "button, a, input, textarea, select, summary, [contenteditable='true']";
const freeOffsets = [
  [-380, -260],
  [-265, -120],
  [-150, -310],
  [-45, -180],
  [75, -340],
  [185, -200],
  [295, -290],
  [405, -150],
] as const;

type ExperienceContextValue = {
  selected: ScenarioId[];
  resetSelection: () => void;
  toggleScenario: (id: ScenarioId) => void;
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

function isScenarioId(value: unknown): value is ScenarioId {
  return SCENARIOS.some((scenario) => scenario.id === value);
}

function subscribeToPresentation(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(PRESENTATION_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(PRESENTATION_EVENT, callback);
  };
}

function getPresentationSnapshot() {
  return new URLSearchParams(window.location.search).get("present") === "1";
}

function getServerPresentationSnapshot() {
  return false;
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error("useExperience must be used inside ExperienceShell");
  }
  return context;
}

export function ExperienceShell({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);
  const skippedFirstPersistence = useRef(false);
  const [selected, setSelected] = useState<ScenarioId[]>([]);
  const [currentScene, setCurrentScene] = useState(0);
  const presentMode = useSyncExternalStore(
    subscribeToPresentation,
    getPresentationSnapshot,
    getServerPresentationSnapshot,
  );

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const parsed: unknown = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        window.localStorage.removeItem(STORAGE_KEY);
        return;
      }

      const restored = [...new Set(parsed.filter(isScenarioId))];
      if (restored.length > 0) {
        // Storage is an external system and must hydrate after the deterministic SSR pass.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelected(restored);
      }
    } catch {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Restricted storage must not make the interactive story unusable.
      }
    }
  }, []);

  useEffect(() => {
    if (!skippedFirstPersistence.current) {
      skippedFirstPersistence.current = true;
      return;
    }

    try {
      if (selected.length === 0) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
      }
    } catch {
      // The in-memory selection remains fully usable when storage is unavailable.
    }
  }, [selected]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-scene]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;

        const index = scenes.indexOf(visible.target as HTMLElement);
        if (index >= 0) setCurrentScene(index);
      },
      { threshold: [0.3, 0.55, 0.75] },
    );

    scenes.forEach((scene) => observer.observe(scene));
    return () => observer.disconnect();
  }, []);

  const setMode = useCallback((next: boolean) => {
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("present", "1");
    else url.searchParams.delete("present");
    window.history.replaceState({}, "", url);
    window.dispatchEvent(new Event(PRESENTATION_EVENT));
  }, []);

  const goToScene = useCallback((index: number) => {
    const scenes = rootRef.current?.querySelectorAll<HTMLElement>("[data-scene]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scenes?.[index]?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    if (!presentMode) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMode(false);
        return;
      }

      const target = event.target;
      if (target instanceof Element && target.closest(interactiveSelector)) return;

      let nextScene: number | null = null;
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) {
        nextScene = Math.min(SCENE_COUNT - 1, currentScene + 1);
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
        nextScene = Math.max(0, currentScene - 1);
      } else if (event.key === "Home") {
        nextScene = 0;
      } else if (event.key === "End") {
        nextScene = SCENE_COUNT - 1;
      }

      if (nextScene === null) return;
      event.preventDefault();
      goToScene(nextScene);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentScene, goToScene, presentMode, setMode]);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.from(".hero-copy > *", {
            y: 28,
            opacity: 0,
            duration: 0.8,
            stagger: 0.09,
            ease: "power3.out",
          });

          if (!presentMode) {
            gsap.fromTo(
              ".free-hour",
              {
                x: (index) => freeOffsets[index]?.[0] ?? 0,
                y: (index) => freeOffsets[index]?.[1] ?? 0,
                rotate: (index) => (index % 2 === 0 ? -5 : 5),
                opacity: 0.18,
              },
              {
                x: 0,
                y: 0,
                rotate: 0,
                opacity: 1,
                stagger: 0.06,
                ease: "power2.inOut",
                scrollTrigger: {
                  trigger: ".hero-story",
                  start: "top top",
                  end: "bottom 75%",
                  scrub: 0.8,
                },
              },
            );
          }

          gsap.utils.toArray<HTMLElement>(".reveal-rule").forEach((element) => {
            gsap.from(element, {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: { trigger: element, start: "top 82%" },
            });
          });
        },
      );

      return () => media.revert();
    },
    { scope: rootRef, dependencies: [presentMode], revertOnUpdate: true },
  );

  const toggleScenario = useCallback((id: ScenarioId) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  }, []);

  const resetSelection = useCallback(() => setSelected([]), []);
  const contextValue = useMemo(
    () => ({ selected, resetSelection, toggleScenario }),
    [resetSelection, selected, toggleScenario],
  );

  return (
    <ExperienceContext.Provider value={contextValue}>
      <main
        ref={rootRef}
        className="site-shell"
        data-present={presentMode ? "true" : "false"}
      >
        <a className="skip-link" href="#week">
          Перейти к конструктору недели
        </a>

        <header className="site-header">
          <a className="brand-mark" href="#top" aria-label="Alex Fintore — начало страницы">
            <span className="brand-square" aria-hidden="true" />
            <span>Alex Fintore / Практика ИИ</span>
          </a>
          <div
            className="header-progress"
            aria-label={`Сцена ${currentScene + 1} из ${SCENE_COUNT}`}
          >
            <span>{String(currentScene + 1).padStart(2, "0")}</span>
            <span className="header-progress-line" aria-hidden="true">
              <span style={{ width: `${((currentScene + 1) / SCENE_COUNT) * 100}%` }} />
            </span>
            <span>{String(SCENE_COUNT).padStart(2, "0")}</span>
          </div>
          <button
            className="mode-button"
            type="button"
            onClick={() => setMode(!presentMode)}
            aria-pressed={presentMode}
          >
            {presentMode ? "Обычный режим" : "Режим выступления"}
          </button>
        </header>

        {children}
      </main>
    </ExperienceContext.Provider>
  );
}
