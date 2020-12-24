import { useMemo } from "react";
import * as THREE from "three";
import { Material } from "three";

type FrameProps = {
  width: number;
  height: number;
  back?: boolean;
  material?: Material;
};

const frameWidth = 0.3;
const frameDepth = 0.1;
const borderThickness = 0.2;
const borderDepth = 0.2;
const meshOffset = 0.0005;

const Frame = (props: FrameProps) => {
  const { back, width, height, material: passedMaterial } = props;

  const material = useMemo(
    () =>
      passedMaterial ||
      new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.8,
        metalness: 0.05,
      }),
    []
  );

  return (
    <group>
      {back && (
        <mesh position-z={[-0.1 - meshOffset]} material={material}>
          <boxBufferGeometry
            attach="geometry"
            args={[width + frameWidth, height + frameWidth, frameDepth]}
          />
        </mesh>
      )}
      {/* top */}
      <mesh
        position-y={height / 2 + frameWidth / 2 - borderThickness / 2}
        material={material}
      >
        <boxBufferGeometry
          attach="geometry"
          args={[width + frameWidth, borderThickness, borderDepth]}
        />
      </mesh>
      {/* bottom */}
      <mesh
        position-y={-height / 2 - frameWidth / 2 + borderThickness / 2}
        material={material}
      >
        <boxBufferGeometry
          attach="geometry"
          args={[width + frameWidth, borderThickness, borderDepth]}
        />
      </mesh>
      {/* left */}
      <mesh
        position-x={-width / 2 - frameWidth / 2 + borderThickness / 2}
        material={material}
      >
        <boxBufferGeometry
          attach="geometry"
          args={[borderThickness, height + frameWidth, borderDepth]}
        />
      </mesh>
      {/* right */}
      <mesh
        position-x={width / 2 + frameWidth / 2 - borderThickness / 2}
        material={material}
      >
        <boxBufferGeometry
          attach="geometry"
          args={[borderThickness, height + frameWidth, borderDepth]}
        />
      </mesh>
    </group>
  );
};

export default Frame;
