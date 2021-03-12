import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";

/**
 * A modified version of the controlled progress hooks that adds
 * - a minimum wait time, in case it takes a second to register an asset
 * - a delay after it reaches 100 in case it goes back down
 * - a timeout when it reaches > 50%, marked as stuck
 */
export const useControlledProgress = () => {
  const TIMEOUT = 750; // minimum time to wait before moving to 100
  const AFTER_TIME = 100; // extra time to prevent bouncing at reaching 100
  const STUCK_TIMEOUT = 5500; // for safari, when stuck at a value above 50

  const { progress, total } = useProgress();

  const startTime = useRef(new Date());
  const controlledProgress = useRef(0);
  const finished = useRef(false);
  const [, setForceRender] = useState(0);

  useEffect(() => {
    const newTime = new Date();
    const timeElapsed = newTime.getTime() - startTime.current.getTime();
    const diff = Math.min(
      progress - controlledProgress.current,
      timeElapsed < TIMEOUT ? 99 : 100
    );
    if (diff > 0) {
      if (progress === 100) {
        finished.current = true;
        // if progress 100, check in AFTER_TIME ms to make sure it hasn't
        // bounced back down
        setTimeout(() => {
          if (finished.current) {
            controlledProgress.current = progress;
            // set state to force re render
            setForceRender(Math.random());
          }
        }, AFTER_TIME);
      } else {
        finished.current = false;
        controlledProgress.current = progress;

        // once above 50, skip progress is stuck then skip loading
        if (progress > 50) {
          setTimeout(() => {
            if (controlledProgress.current === progress) {
              setSkip(true);
            }
          }, STUCK_TIMEOUT);
        }
      }
    }
  }, [progress]);

  // wait TIMEOUT (ms) to check if any objects are waiting to be loaded
  const [counter, setCounter] = useState(0);
  const [skip, setSkip] = useState(false);
  useEffect(() => {
    if (total > 0) {
      return;
    } else if (counter > 0) {
      setSkip(true);
    } else {
      setTimeout(() => setCounter(counter + 1), TIMEOUT);
    }
  }, [counter]);

  return skip ? 100 : Math.floor(controlledProgress.current);
};
