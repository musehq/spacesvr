import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { Material } from "three";
import Frame from "./misc/Frame";
import { useTexture } from "@react-three/drei";

type ImageProps = JSX.IntrinsicElements["group"] & {
  src: string;
  size?: number;
  framed?: boolean;
  frameMaterial?: Material;
  frameWidth?: number;
  innerFrameMaterial?: Material;
  transparent: boolean;
};

const UnsuspensedImage = (props: ImageProps) => {
  const {
    src,
    size = 1,
    framed,
    frameMaterial,
    frameWidth = 1,
    innerFrameMaterial,
    transparent,
  } = props;

  const texture = useTexture(src);

  const width = useMemo(() => texture.image.width, [texture]);
  const height = useMemo(() => texture.image.height, [texture]);

  const max = Math.max(width, height);
  const WIDTH = (width / max) * size,
    HEIGHT = (height / max) * size;

  return (
    <group {...props}>
      <mesh>
        <planeBufferGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial
          map={texture}
          side={THREE.DoubleSide}
          transparent={Boolean(transparent || innerFrameMaterial)}
        />
      </mesh>
      {framed && (
        <Frame
          width={WIDTH}
          height={HEIGHT}
          thickness={frameWidth}
          material={frameMaterial}
          innerFrameMaterial={innerFrameMaterial}
          transparent={transparent}
        />
      )}
    </group>
  );
};

export const Image = (props: ImageProps) => {
  return (
    <Suspense fallback={null}>
      <UnsuspensedImage {...props} />
    </Suspense>
  );
};
