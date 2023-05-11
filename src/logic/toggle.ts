import { useCallback, useEffect, useRef, useState } from "react";
import Timeout = NodeJS.Timeout;

/**
 * A hook that allows you to toggle a boolean value.
 * @param delay time in ms
 */
export const useDelayedToggle = (delay = 1000) => {
  const timeoutId = useRef<Timeout | null>(null);
  const [active, setActiveState] = useState(false);

  const setActive = useCallback(() => {
    if (timeoutId.current !== null) {
      clearTimeout(timeoutId.current);
    }

    setActiveState(true);

    timeoutId.current = setTimeout(() => {
      setActiveState(false);
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return { active, setActive };
};
