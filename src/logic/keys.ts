import { MutableRefObject, useEffect, useRef } from "react";

/*
  hook to detect when the meta key (cmd on mac, ctrl on windows) is pressed
  includes a timeout since moving your finger to hold it down can jitter a bit
  returns ref containing the state of the press
 */
export const useMetaHold = (): MutableRefObject<boolean> => {
  const meta = useRef(false);
  const timestamp = useRef<number>();
  const TIMEOUT = 75;

  useEffect(() => {
    const onKeyChange = (e: KeyboardEvent) => {
      const newMeta = e.ctrlKey || e.metaKey;

      if (meta.current && !newMeta) {
        if (!timestamp.current) {
          timestamp.current = new Date().getTime();
          setTimeout(() => {
            meta.current = false;
            timestamp.current = undefined;
          }, TIMEOUT);
        }
      } else {
        meta.current = newMeta;
      }
    };

    document.addEventListener("keydown", onKeyChange);
    document.addEventListener("keyup", onKeyChange);
    return () => {
      document.removeEventListener("keydown", onKeyChange);
      document.removeEventListener("keyup", onKeyChange);
    };
  }, [TIMEOUT]);

  return meta;
};

/**
 * Same as useMetaHold but for shift
 */
export const useShiftHold = (): MutableRefObject<boolean> => {
  const shift = useRef(false);
  const timestamp = useRef<number>();
  const TIMEOUT = 75;

  useEffect(() => {
    const onKeyChange = (e: KeyboardEvent) => {
      const newShift = e.shiftKey;

      if (shift.current && !newShift) {
        if (!timestamp.current) {
          timestamp.current = new Date().getTime();
          setTimeout(() => {
            shift.current = false;
            timestamp.current = undefined;
          }, TIMEOUT);
        }
      } else {
        shift.current = newShift;
      }
    };

    document.addEventListener("keydown", onKeyChange);
    document.addEventListener("keyup", onKeyChange);
    return () => {
      document.removeEventListener("keydown", onKeyChange);
      document.removeEventListener("keyup", onKeyChange);
    };
  }, [TIMEOUT]);

  return shift;
};

/**
 * hook to run a callback when a given key is pressed
 * @param keys key or keys to listen for, by .key property
 * @param callback callback to run when key is pressed
 * @param deps any additional dependencies to watch for changes
 */
export const useKeypress = (
  keys: string | string[],
  callback: (e: KeyboardEvent) => void,
  deps?: any[]
) => {
  useEffect(() => {
    const locKeys = Array.isArray(keys) ? keys : [keys];

    const thisCallback = (e: KeyboardEvent) => {
      if (locKeys.includes(e.key)) callback(e);
    };
    document.addEventListener("keypress", thisCallback);
    return () => {
      document.removeEventListener("keypress", thisCallback);
    };
  }, [callback, keys, ...(deps || [])]);
};
