import { MutableRefObject, useCallback, useState } from "react";
import { MathUtils, PerspectiveCamera } from "three";

export type Fov = {
  val: number;
  normalized: number;
  set: (newVal: number) => void;
  min: number;
  max: number;
};

const MIN_FOV = 10;
const MAX_FOV = 85;

export const useFov = (
  cam: MutableRefObject<PerspectiveCamera | undefined>
): Fov => {
  const [fov, setFov] = useState(50);

  const change = useCallback(
    (newVal: number) => {
      if (!cam.current) return;
      const fov = MathUtils.clamp(newVal, MIN_FOV, MAX_FOV);
      cam.current.fov = fov;
      cam.current.updateProjectionMatrix();

      setFov(fov);
    },
    [cam]
  );

  return {
    val: fov,
    normalized: (fov - MIN_FOV) / (MAX_FOV - MIN_FOV),
    set: change,
    min: MIN_FOV,
    max: MAX_FOV,
  };
};
