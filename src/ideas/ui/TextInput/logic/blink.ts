import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Group } from "three";

const RESET_TIMEOUT = 1; // seconds

export const useCaretBlink = (rate = 1) => {
  const blinkRef = useRef<Group>(null);

  const clock = useThree((st) => st.clock);

  const startTime = useRef(0);

  useFrame(({ clock }) => {
    if (!blinkRef.current) return;
    const diff = clock.getElapsedTime() - startTime.current;
    if (diff < RESET_TIMEOUT) {
      blinkRef.current.visible = true;
    } else {
      // formula below makes sure that after RESET_TIMEOUT blinking starts on off
      blinkRef.current.visible = Boolean(
        Math.round(
          (-Math.sin(rate * Math.PI * 2 * (diff - RESET_TIMEOUT)) + 1) / 2
        )
      );
    }
  });

  const reset = () => {
    startTime.current = clock.getElapsedTime();
  };

  return { blinkRef, reset };
};
