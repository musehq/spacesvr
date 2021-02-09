import { useMemo } from "react";
import * as THREE from "three";
import { Material } from "three";

type FrameProps = {
  width: number;
  height: number;
  back?: boolean;
  material?: Material;
};

/**
 *
 * Builds a frame for a mesh with a texture (image, video, etc.)
 *
 * In the code, the frame is the back panel and the border is the
 * four meshes that make up the top, left, right, and bottom sides
 * of the border.
 *
 * @param props
 * @constructor
 */
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

  const frameDepth = 0.025;
  const frameWidth = 0.06;
  const borderDepth = 0.05;
  const borderThickness = 0.05;
  const meshOffset = 0.0005;

  return (
    <group>
      {back && (
        <mesh position-z={[-frameDepth - meshOffset]} material={material}>
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
