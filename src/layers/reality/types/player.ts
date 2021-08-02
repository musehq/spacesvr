import * as THREE from "three";
import { Vector3 } from "three";

export type PlayerState = {
  position: PlayerVec;
  velocity: PlayerVec;
  controls: PlayerControls;
  raycaster: THREE.Raycaster;
};

export type PlayerVec = {
  set: (vec: Vector3) => void;
  get: () => Vector3;
};

export type PlayerControls = {
  lock: () => void;
  unlock: () => void;
  isLocked: () => boolean;
};
