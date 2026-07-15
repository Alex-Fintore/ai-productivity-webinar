"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CopyStatus = "idle" | "success" | "error";

function fallbackCopy(value: string) {
  const activeElement = document.activeElement as HTMLElement | null;
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus({ preventScroll: true });
  textarea.select();

  try {
    if (!document.execCommand("copy")) {
      throw new Error("Copy command was rejected");
    }
  } finally {
    textarea.remove();
    activeElement?.focus({ preventScroll: true });
  }
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    let timeoutId: number | null = null;
    try {
      await Promise.race([
        navigator.clipboard.writeText(value),
        new Promise<never>((_, reject) => {
          timeoutId = window.setTimeout(
            () => reject(new Error("Clipboard request timed out")),
            700,
          );
        }),
      ]);
      return;
    } catch {
      // Fall back for permission-restricted browsers and embedded previews.
    } finally {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    }
  }

  fallbackCopy(value);
}

export function useCopyFeedback() {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const copy = useCallback(async (value: string) => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);

    try {
      await copyToClipboard(value);
      setStatus("success");
    } catch {
      setStatus("error");
    }

    timerRef.current = window.setTimeout(() => setStatus("idle"), 2200);
  }, []);

  return { copy, status };
}
