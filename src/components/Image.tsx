import { useRef } from "react";
import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import { Material } from "three";
import Frame from "./misc/Frame";

type ImageProps = JSX.IntrinsicElements["group"] & {
  src: string;
  size: [number, number];
  framed?: boolean;
  doubleSided?: boolean;
  material?: Material;
};

export const Image = (props: ImageProps) => {
  const { src, size, framed, doubleSided, material } = props;

  const texture = useLoader(THREE.TextureLoader, src);
  const image = useRef<THREE.Mesh>();
  const [width, height] = size;

  return (
    <group {...props}>
      <mesh castShadow ref={image}>
        <planeBufferGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          side={doubleSided ? THREE.DoubleSide : undefined}
        />
      </mesh>
      {framed && (
        <Frame
          back={!doubleSided}
          width={width}
          height={height}
          material={material}
        />
      )}
    </group>
  );
};
