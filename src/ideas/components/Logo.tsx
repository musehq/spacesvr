import { Suspense, useRef } from "react";
import { GroupProps, useFrame } from "@react-three/fiber";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { DRACO_URL } from "../../utils/constants";

type GLTFResult = GLTF & {
  nodes: {
    Sphere: THREE.Mesh;
  };
  materials: {
    Sphere: THREE.MeshStandardMaterial;
  };
};

const SPEED = 0.2;

type LogoProps = {
  floating?: boolean;
  rotating?: boolean;
} & GroupProps;

const FILE_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/models/SpacesSphere1/SpacesSphere1.glb";

export function Logo(props: LogoProps) {
  const { rotating, floating, ...rest } = props;

  const group = useRef<THREE.Group>();
  const sphereGroup = useRef<THREE.Group>();
  const { nodes, materials } = useGLTF(FILE_URL, DRACO_URL) as GLTFResult;

  useFrame(({ clock }) => {
    if (group.current && rotating) {
      group.current.rotation.y = clock.getElapsedTime() * SPEED;
    }

    if (group.current && floating) {
      group.current.position.y =
        0.1 * 2 * Math.sin(clock.getElapsedTime() * SPEED * 2);
    }
  });

  return (
    <group name="spacesvr-logo" {...rest}>
      <group ref={group}>
        <Suspense fallback={null}>
          <group ref={sphereGroup} scale={[100, 100, 100]} dispose={null}>
            <group position={[0, 0, 0]}>
              <mesh
                material={materials.Sphere}
                geometry={nodes.Sphere.geometry}
                castShadow
              />
            </group>
          </group>
        </Suspense>
      </group>
    </group>
  );
}
