import { BufferGeometry } from "three";
import { SimplifyModifier } from "../lib/SimplifyModifier";

export const generateSimplifiedGeo = (
  geo: BufferGeometry,
  triTarget: number
) => {
  const modifier = new SimplifyModifier();
  return modifier.modify(geo, Math.floor(triTarget));
};
