import { MutableRefObject, useMemo } from "react";

type PlayerControls = {
  lock: () => void;
  unlock: () => void;
  isLocked: () => boolean;
};

export const useControlLock = (
  lockControls: MutableRefObject<boolean>
): PlayerControls => {
  return useMemo(
    () => ({
      lock: () => (lockControls.current = true),
      unlock: () => (lockControls.current = false),
      isLocked: () => lockControls.current,
    }),
    [lockControls]
  );
};
