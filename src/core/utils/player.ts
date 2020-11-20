import { Vector3 } from "three";
import { Api } from "@react-three/cannon";
import { MutableRefObject } from "react";
import * as THREE from "three";
import { PlayerControls, PlayerRef, PlayerVec } from "../types";

export function createPlayerRef(
  bodyApi: Api[1],
  position: MutableRefObject<Vector3>,
  velocity: MutableRefObject<Vector3>,
  lockControls: MutableRefObject<boolean>,
  raycaster: MutableRefObject<THREE.Raycaster>
): PlayerRef {
  const posVec: PlayerVec = {
    set: (vec: Vector3) => bodyApi.position.set(vec.x, vec.y, vec.z),
    get: () => position.current,
  };

  const velVec: PlayerVec = {
    set: (vec: Vector3) => bodyApi.velocity.set(vec.x, vec.y, vec.z),
    get: () => velocity.current,
  };

  const controls: PlayerControls = {
    lock: () => (lockControls.current = true),
    unlock: () => (lockControls.current = false),
    isLocked: () => lockControls.current,
  };

  const playerRef: PlayerRef = {
    position: posVec,
    velocity: velVec,
    controls,
    raycaster: raycaster.current,
  };

  return playerRef;
}
