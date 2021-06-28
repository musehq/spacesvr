import { Object3D, Vector3 } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

export type ControlType =
  | null
  | "position"
  | "rotation"
  | "scale"
  | "color"
  | "premaPanel";
export type Action = {
  target: Object3D;
  attribute: string;
  value: any;
};
export type Editor = {
  editObject: Object3D | undefined;
  editor: Object3D | undefined;
  mouseDown: string;
  intersection?: Vector3 | null;
};

export type GLTFResult = GLTF & {
  nodes: {
    ["prema-panel"]: THREE.Mesh;
    undo: THREE.Mesh;
    redo: THREE.Mesh;
    move: THREE.Mesh;
    rotate: THREE.Mesh;
    size: THREE.Mesh;
    publish: THREE.Mesh;
    hamburger: THREE.Mesh;
    close: THREE.Mesh;
    check: THREE.Mesh;
    trash: THREE.Mesh;
    ["props-box"]: THREE.Mesh;
    ["props-click"]: THREE.Mesh;
    ["undo-click"]: THREE.Mesh;
    ["redo-click"]: THREE.Mesh;
    ["move-click"]: THREE.Mesh;
    ["rotate-click"]: THREE.Mesh;
    ["scale-click"]: THREE.Mesh;
    ["placeholder-click"]: THREE.Mesh;
    ["publish-click"]: THREE.Mesh;
    hotbar: THREE.Mesh;
  };
  materials: {
    black: THREE.MeshStandardMaterial;
    white: THREE.MeshStandardMaterial;
    green: THREE.MeshStandardMaterial;
    red: THREE.MeshStandardMaterial;
    grey: THREE.MeshStandardMaterial;
  };
};
