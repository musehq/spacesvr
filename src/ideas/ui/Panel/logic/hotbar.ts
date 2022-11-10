import { GLTF } from "three-stdlib";
import * as THREE from "three";
import { useModel } from "../../../../logic/assets";

const FILE_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/models/wand-iconds_03-1634334334/wand-icons_03.glb.gz";

export type HotbarGLTF = GLTF & {
  nodes: {
    ["prema-panel"]: THREE.Mesh;
    redo: THREE.Mesh;
    move: THREE.Mesh;
    rotate: THREE.Mesh;
    size: THREE.Mesh;
    publish: THREE.Mesh;
    check: THREE.Mesh;
    trash: THREE.Mesh;
    ["publish-click"]: THREE.Mesh;
    button: THREE.Mesh;
    undo: THREE.Mesh;
    add: THREE.Mesh;
    close: THREE.Mesh;
    duplicate: THREE.Mesh;
  };
  materials: {
    black: THREE.MeshStandardMaterial;
    white: THREE.MeshStandardMaterial;
    green: THREE.MeshStandardMaterial;
    grey: THREE.MeshStandardMaterial;
    ["black.001"]: THREE.MeshStandardMaterial;
    ["red.002"]: THREE.MeshStandardMaterial;
  };
};

export const useHotbar = (): HotbarGLTF => useModel(FILE_URL) as HotbarGLTF;
