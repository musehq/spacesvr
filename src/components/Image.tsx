import { Suspense, useEffect, useState } from "react";
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

  const isKtx = src.includes(".ktx2");
  const ogWidth = 1,
    ogHeight = 1;

  const texture = useLoader(
    // @ts-ignore
    isKtx ? KTX2Loader : THREE.TextureLoader,
    src,
    (loader: KTX2Loader) => {
      if (isKtx) {
        loader.setTranscoderPath(
          "https://d27rt3a60hh1lx.cloudfront.net/basis-transcoder/"
        );
        loader.detectSupport(gl);
      }
    }
  );

  const [width, setWidth] = useState<number>(texture.image.width);
  const [height, setHeight] = useState<number>(texture.image.height);

  const max = Math.max(width, height);
  const WIDTH = (width / max) * size,
    HEIGHT = (height / max) * size;

  if (isKtx) {
    const ogSizeUrl = `${src.slice(0, -4)}txt`;
    const request = new XMLHttpRequest();
    request.open("GET", ogSizeUrl, true);
    request.send(null);
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        const type = request.getResponseHeader("Content-Type");
        if (type !== null && type.indexOf("text") !== 1) {
          const requestArr = request.responseText.split("\n");
          setWidth(Number.parseInt(requestArr[0]));
          setHeight(Number.parseInt(requestArr[1]));
        }
      }
    };
  }

  return (
    <group {...props}>
      <mesh rotation-x={isKtx ? Math.PI : 0}>
        <planeBufferGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
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
