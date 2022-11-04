import { PerspectiveCamera } from "three";

const PADDING_X = 0.125;
const PADDING_Y = 0.125;

export const getHudPos = (
  pos: [number, number],
  camera: PerspectiveCamera,
  distance: number
) => {
  const vFOV = (camera.fov * Math.PI) / 180;
  const height = 2 * Math.tan(vFOV / 2) * Math.abs(distance);
  const width = height * camera.aspect;

  const x = pos[0] * (width - PADDING_X * 2) * 0.5;
  const y = pos[1] * (height - PADDING_Y * 2) * 0.5;

  return { x, y };
};
