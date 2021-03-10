import { useRef } from "react";
import { Clock } from "three";

type Limiter = {
  isReady: (clock: Clock) => boolean;
};

/**
 * Returns a function that, when used every frame, will mark itself
 * as ready maximum {frequency} times per second.
 *
 * @param frequency How many times per second to be marked as ready
 */
export const useLimiter = (frequency: number): Limiter => {
  const lastCall = useRef(0);

  return {
    isReady: (clock: Clock) => {
      const time = clock.getElapsedTime();
      const ready = time - lastCall.current > 1 / frequency;
      if (ready) {
        lastCall.current = time;
      }
      return ready;
    },
  };
};
