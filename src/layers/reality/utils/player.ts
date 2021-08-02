import { Vector3 } from "three";
import { Api } from "@react-three/cannon";
import { MutableRefObject } from "react";
import * as THREE from "three";
import { PlayerState } from "../types/player";

export function createPlayerState(
  bodyApi: Api[1],
  position: MutableRefObject<Vector3>,
  velocity: MutableRefObject<Vector3>,
  lockControls: MutableRefObject<boolean>,
  raycaster: THREE.Raycaster
): PlayerState {
  return {
    position: {
      set: (pos: Vector3) => bodyApi.position.copy(pos),
      get: () => position.current,
    },
    velocity: {
      set: (vec: Vector3) => bodyApi.velocity.copy(vec),
      get: () => velocity.current,
    },
    controls: {
      lock: () => (lockControls.current = true),
      unlock: () => (lockControls.current = false),
      isLocked: () => lockControls.current,
    },
    raycaster,
  };
}
