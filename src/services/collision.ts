import { useMemo } from "react";
import * as THREE from "three";
import { BufferGeometry } from "three";
import { useConvexPolyhedron, useTrimesh } from "@react-three/cannon";

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

export const useConvexCollision = (geometry: BufferGeometry) => {
  const geo = useMemo(() => new THREE.Geometry().fromBufferGeometry(geometry), [
    geometry,
  ]);

  const [hitbox] = useConvexPolyhedron(() => ({
    type: "Static",
    args: geo,
  }));

  return hitbox;
};
