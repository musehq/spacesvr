import * as THREE from "three";
import { Vector3 } from "three";

export type PlayerRef = {
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
