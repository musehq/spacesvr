import { useEffect } from "react";

import { useThree } from "react-three-fiber";
import { UnsignedByteType } from "three";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

type HDRIProps = {
  src: string;
  hideBackground?: boolean;
};

export const HDRI = (props: HDRIProps) => {
  const { src, hideBackground } = props;
  const { gl, scene } = useThree();

  // actual file loader
  const loader = new RGBELoader();
  loader.setDataType(UnsignedByteType);

  useEffect(() => {
    loader.load(src, (texture) => {
      const opts = {
        format: THREE.RGBAFormat,
        generateMipmaps: false,
        magFilter: THREE.NearestFilter,
        minFilter: THREE.NearestFilter,
      };
      const envMap = new THREE.WebGLCubeRenderTarget(
        4096,
        opts
      ).fromEquirectangularTexture(gl, texture);

      // sent envmap onto scene env and background
      if (!hideBackground) {
        scene.background = envMap;
      }
      // @ts-ignore
      scene.environment = envMap;

      texture.dispose();

      return () => {
        envMap.dispose();
      };
    });
  }, [src, scene, loader, hideBackground]);

  return null;
};
