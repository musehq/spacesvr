import { useFrame, useThree } from "@react-three/fiber";
import { MutableRefObject, useRef } from "react";
import { Group } from "three";

const RESET_TIMEOUT = 1; // seconds, amount of time to wait after reset before continuing to blink

type BlinkManager = {
  blinkRef: MutableRefObject<Group | null>; // to be assigned to the caret to be blinked
  reset: () => void; // to be called when the caret is moved and hold off blinking
};

/**
 * Manages the blinking of a caret.
 * @param rate
 */
export const useCaretBlink = (rate = 1): BlinkManager => {
  const blinkRef = useRef<Group>(null);

  const clock = useThree((st) => st.clock);

  const startTime = useRef(0);

  useFrame(({ clock }) => {
    if (!blinkRef.current) return;
    const diff = clock.elapsedTime - startTime.current;
    if (diff < RESET_TIMEOUT) {
      blinkRef.current.visible = true;
    } else {
      // formula below makes sure that after exactly RESET_TIMEOUT, blinking starts with "off"
      blinkRef.current.visible = Boolean(
        Math.round(
          (-Math.sin(rate * Math.PI * 2 * (diff - RESET_TIMEOUT)) + 1) / 2
        )
      );
    }
  });

  const reset = () => {
    startTime.current = clock.elapsedTime;
  };

  return { blinkRef, reset };
};
