import { Suspense, useEffect } from "react";
import * as THREE from "three";
import { useLoader, useThree } from "@react-three/fiber";
import { Material } from "three";
import Frame from "./misc/Frame";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";

type ImageProps = JSX.IntrinsicElements["group"] & {
  src: string;
  size?: number;
  framed?: boolean;
  frameMaterial?: Material;
  frameWidth?: number;
};

const UnsuspensedImage = (props: ImageProps) => {
  const { src, size = 1, framed, frameMaterial, frameWidth = 1 } = props;
  const { gl } = useThree();

  const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  const ktx = src.includes(".ktx2");

  // @ts-ignore
  const texture = useLoader(
    ktx ? KTX2Loader : THREE.TextureLoader,
    src,
    (loader: KTX2Loader) => {
      if (ktx) {
        loader.setTranscoderPath(
          "https://d27rt3a60hh1lx.cloudfront.net/basis-transcoder/"
        );
        loader.detectSupport(gl);
      }
    }
  );

  const width = texture.image.width;
  const height = texture.image.height;

  const max = Math.max(width, height);
  const WIDTH = (width / max) * size;
  const HEIGHT = (height / max) * size;

  return (
    <group {...props}>
      <mesh material={material}>
        <planeBufferGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial map={texture} />
      </mesh>
      {framed && (
        <Frame
          width={WIDTH}
          height={HEIGHT}
          thickness={frameWidth}
          material={frameMaterial}
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
