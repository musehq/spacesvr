import { useRef } from "react";
import { Clock } from "three";

type Limiter = {
  isReady: (clock: Clock) => boolean;
};

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
