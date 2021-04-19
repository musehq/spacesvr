import { BufferGeometry } from "three";
import { useTrimesh } from "@react-three/cannon";

export const useTrimeshCollision = (geometry: BufferGeometry) => {
  const vertices = geometry.attributes.position.array;
  // @ts-ignore
  const indices = geometry.index.array;

  // @ts-ignore
  const [hitbox] = useTrimesh(() => ({
    type: "Static",
    args: [vertices, indices],
  }));

  return hitbox;
};
