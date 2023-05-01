import { useCallback, useRef, useState } from "react";

/**
 * A hook that allows you to toggle a boolean value.
 * @param delay time in ms
 */
export const useDelayedToggle = (delay = 1000) => {
  const lastTimeSet = useRef(0);
  const [active, setActiveState] = useState(false);

  if (active && Date.now() - lastTimeSet.current > delay) {
    lastTimeSet.current = Date.now();
    setActiveState(!active);
  }

  const setActive = useCallback(() => {
    setActiveState(true);
    lastTimeSet.current = Date.now();
    setTimeout(() => {
      if (Date.now() - lastTimeSet.current > delay) setActiveState(false);
    }, delay);
  }, [delay]);

  return { active, setActive };
};
