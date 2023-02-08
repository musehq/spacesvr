import { PerspectiveCamera, Vector2 } from "three";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";

const PADDING_X = 0.125;
const PADDING_X_2 = PADDING_X * 2;
const PADDING_Y = 0.125;
const PADDING_Y_2 = PADDING_Y * 2;

const RAD_PER_DEG_2 = Math.PI / 180 / 2;

export const getHudPos = (
  pos: [number, number] | Vector2,
  camera: PerspectiveCamera,
  distance: number,
  target?: Vector2
) => {
  const vFOV = camera.fov * RAD_PER_DEG_2;
  const height = 2 * Math.tan(vFOV) * Math.abs(distance);
  const width = height * camera.aspect;

  const px = (pos as Vector2).x || (pos as [number, number])[0];
  const py = (pos as Vector2).y || (pos as [number, number])[1];

  const x = px * (width - PADDING_X_2) * 0.5;
  const y = py * (height - PADDING_Y_2) * 0.5;

  if (target) {
    target.x = x;
    target.y = y;
    return target;
  }

  return new Vector2(x, y);
};

export const getHudDims = (camera: PerspectiveCamera, distance: number) => {
  const vFOV = camera.fov * RAD_PER_DEG_2;
  const height = 2 * Math.tan(vFOV) * Math.abs(distance);
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
