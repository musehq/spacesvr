import { useEffect } from "react";

import { useThree } from "@react-three/fiber";
import {
  NearestFilter,
  RGBAFormat,
  UnsignedByteType,
  WebGLCubeRenderTarget,
} from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

type HDRIProps = {
  src: string;
  hideBackground?: boolean;
};

export const HDRI = (props: HDRIProps) => {
  const { src, hideBackground } = props;
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  // actual file loader
  const loader = new RGBELoader();
  loader.setDataType(UnsignedByteType);

  useEffect(() => {
    loader.load(src, (texture) => {
      const opts = {
        format: RGBAFormat,
        generateMipmaps: false,
        magFilter: NearestFilter,
        minFilter: NearestFilter,
      };
      const envMap = new WebGLCubeRenderTarget(
        4096,
        opts
      ).fromEquirectangularTexture(gl, texture).texture;

      // sent envmap onto scene env and background
      if (!hideBackground) {
        scene.background = envMap;
      }
      scene.environment = envMap;

      texture.dispose();

      return () => {
        envMap.dispose();
      };
    });
  }, [src, scene, loader, hideBackground]);

  return null;
};
