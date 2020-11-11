import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import { Color, Group, Vector2, Material } from "three";

type ImageProps = JSX.IntrinsicElements["group"] & {
  src: string;
  ratio: [number, number];
  sizeScale: number;
  framed?: boolean;
  paused?: boolean;
  doubleSided?: boolean;
  material?: Material;
  color?: Color;
};

const frameWidth = 0.3;
const frameDepth = 0.1;
const borderThickness = 0.2;
const borderDepth = 0.2;
const meshOffset = 0.0005;

export const Image = (props: ImageProps) => {
  const {
    src,
    sizeScale,
    ratio,
    framed,
    doubleSided,
    material: passedMaterial,
    color = 0x111111,
  } = props;

  const texture = useLoader(THREE.TextureLoader, src);
  const group = useRef<Group>();
  const image = useRef<THREE.Mesh>();

  // sizing
  const normalizedRatio = new Vector2(ratio[0], ratio[1]).normalize();
  const width = normalizedRatio.x * sizeScale;
  const height = normalizedRatio.y * sizeScale;

  const material = useMemo(
    () =>
      passedMaterial ||
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
        metalness: 0.05,
      }),
    []
  );

  return (
    <group {...props}>
      <group ref={group}>
        <mesh castShadow ref={image}>
          <planeBufferGeometry attach="geometry" args={[width, height]} />
          <meshStandardMaterial
            attach="material"
            map={texture}
            side={doubleSided ? THREE.DoubleSide : undefined}
          />
        </mesh>
        {framed && (
          <>
            {!doubleSided && (
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
          </>
        )}
      </group>
    </group>
  );
};
