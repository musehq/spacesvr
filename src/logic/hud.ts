import { PerspectiveCamera, Vector2 } from "three";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";

const PADDING_X = 0.125;
const PADDING_Y = 0.125;

export const getHudPos = (
  pos: [number, number] | Vector2,
  camera: PerspectiveCamera,
  distance: number,
  target?: Vector2
) => {
  const vFOV = (camera.fov * Math.PI) / 180;
  const height = 2 * Math.tan(vFOV / 2) * Math.abs(distance);
  const width = height * camera.aspect;

  const px = Array.isArray(pos) ? pos[0] : pos.x;
  const py = Array.isArray(pos) ? pos[1] : pos.y;

  const x = px * (width - PADDING_X * 2) * 0.5;
  const y = py * (height - PADDING_Y * 2) * 0.5;

  if (target) {
    target.x = x;
    target.y = y;
    return target;
  } else {
    return new Vector2(x, y);
  }
};

export const getHudDims = (camera: PerspectiveCamera, distance: number) => {
  const vFOV = (camera.fov * Math.PI) / 180;
  const height = 2 * Math.tan(vFOV / 2) * Math.abs(distance);
  const width = height * camera.aspect;

  return { width, height };
};

export const useHudDims = (distance = 1) => {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  return useMemo(() => {
    return getHudDims(camera, distance);
    // make sure aspect is there
  }, [camera, distance, camera.aspect]);
};
