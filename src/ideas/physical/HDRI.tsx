import { useEffect, useMemo } from "react";
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
  size?: number;
  disableBackground?: boolean;
  disableEnvironment?: boolean;
};

export function HDRI(props: HDRIProps) {
  const { src, size = 1204, disableBackground, disableEnvironment } = props;

  const { gl, scene } = useThree();

  const loader = useMemo(
    () => new RGBELoader().setDataType(UnsignedByteType),
    []
  );

  useEffect(() => {
    loader.load(src, (texture) => {
      const opts = {
        format: RGBAFormat,
        generateMipmaps: false,
        magFilter: NearestFilter,
        minFilter: NearestFilter,
      };

      const envMap = new WebGLCubeRenderTarget(
        size,
        opts
      ).fromEquirectangularTexture(gl, texture).texture;

      // sent envmap onto scene env and background
      if (!disableBackground) {
        scene.background = envMap;
      }
      if (!disableEnvironment) {
        scene.environment = envMap;
      }

      texture.dispose();

      return () => {
        scene.background = null;
        scene.environment = null;
        envMap.dispose();
      };
    });
  }, [src, scene, loader, disableBackground, disableEnvironment]);

  return null;
}
