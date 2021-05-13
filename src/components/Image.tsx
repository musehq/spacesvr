import { Suspense } from "react";
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

  const formatStrings = {
    [THREE.RGBAFormat]: "RGBA32",
    [THREE.RGBA_ASTC_4x4_Format]: "RGBA_ASTC_4x4",
    [THREE.RGB_S3TC_DXT1_Format]: "RGB_S3TC_DXT1",
    [THREE.RGBA_S3TC_DXT5_Format]: "RGBA_S3TC_DXT5",
    [THREE.RGB_PVRTC_4BPPV1_Format]: "RGB_PVRTC_4BPPV1",
    [THREE.RGBA_PVRTC_4BPPV1_Format]: "RGBA_PVRTC_4BPPV1",
    [THREE.RGB_ETC1_Format]: "RGB_ETC1",
    [THREE.RGB_ETC2_Format]: "RGB_ETC2",
    [THREE.RGBA_ETC2_EAC_Format]: "RGB_ETC2_EAC",
  };

  let plainTexture = new THREE.Texture(),
    width = 1,
    height = 1;

  if (ktx) {
    const loader = new KTX2Loader();
    loader.setTranscoderPath("three/examples/js/libs/basis/").detectSupport(gl);
    console.log(loader);
    loader.load(
      src,
      (texture) => {
        console.info(`transcoded to ${formatStrings[texture.format]}`);

        material.map = texture;
        material.transparent = true;
        material.needsUpdate = true;

        width = texture.image.width;
        height = texture.image.height;
      },
      (p) => console.log(`...${p}`),
      (e) => console.error(e)
    );
    loader.dispose();
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    plainTexture = useLoader(THREE.TextureLoader, src);
    material.map = plainTexture;
    material.needsUpdate = true;

    width = plainTexture.image.width;
    height = plainTexture.image.height;
  }

  const max = Math.max(width, height);
  const WIDTH = (width / max) * size;
  const HEIGHT = (height / max) * size;

  return (
    <group {...props}>
      <mesh material={material}>
        <planeBufferGeometry args={[WIDTH, HEIGHT]} />
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
