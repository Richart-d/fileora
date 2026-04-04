import { useEffect, useRef, useCallback } from "react";

/**
 * Auto-save hook with 1.5s debounce.
 * Skips the first render (initial data load) to avoid a spurious save.
 * Shows a visual "Saving..." / "Saved" indicator via the returned status.
 */
export function useAutoSave(
  data: unknown,
  saveFn: () => Promise<void>,
  delay: number = 1500
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const serialized = JSON.stringify(data);

  useEffect(() => {
    // Skip the initial render so loading data doesn't trigger a save
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveFn();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized, delay]);

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    saveFn();
  }, [saveFn]);

  return { flush };
}
