import { useRef } from "react";
import { Clock } from "three";
import { RenderCallback, useFrame } from "@react-three/fiber";

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
      const time = clock.elapsedTime;
      const ready = time - lastCall.current > 1 / frequency;
      if (ready) {
        lastCall.current = time;
      }
      return ready;
    },
  };
};

/**
 * A 1:1 copy of useFrame, but adds a limiter
 *
 * Callback will only run {frequency} times per second
 */
export const useLimitedFrame = (
  frequency: number,
  callback: RenderCallback,
  renderPriority?: number
): void => {
  const limiter = useLimiter(frequency);
  useFrame((state, delta) => {
    if (!limiter.isReady(state.clock)) return;
    callback(state, delta);
  }, renderPriority);
};
