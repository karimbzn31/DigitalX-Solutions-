"use client";

import { useEffect } from "react";

export function useKeyboard(key: string, handler: () => void) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === key && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handler();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [key, handler]);
}

export function useCmdK(handler: () => void) {
  useKeyboard("k", handler);
}
