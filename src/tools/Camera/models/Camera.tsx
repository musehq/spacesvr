/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { MeshStandardMaterial } from "three";

type GLTFResult = GLTF & {
  nodes: {
    camera_1: THREE.Mesh;
    camera_2: THREE.Mesh;
  };
  materials: {
    camera_body: THREE.MeshStandardMaterial;
  };
};

export const CAMERA_FILE_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/models/Camera-1652915410/camera_02_cleaned.glb.gz";

export default function Model(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>();
  const { nodes } = useGLTF(CAMERA_FILE_URL) as GLTFResult;

  (nodes.camera_1.material as MeshStandardMaterial).metalness = 0.3;

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="camera">
          <mesh
            name="camera_1"
            geometry={nodes.camera_1.geometry}
            material={nodes.camera_1.material}
          />
          <mesh
            name="camera_2"
            geometry={nodes.camera_2.geometry}
            material={nodes.camera_2.material}
          />
        </group>
      </group>
    </group>
  );
}
