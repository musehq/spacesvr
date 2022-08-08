import { Suspense } from "react";
import { JpegPng } from "./components/JpegPng";
import { KTX2 } from "./components/KTX2";
import { Material } from "three";
import { GroupProps } from "@react-three/fiber";

type ImageProps = {
  src: string;
  size?: number;
  framed?: boolean;
  frameMaterial?: Material;
  frameWidth?: number;
  innerFrameMaterial?: Material;
  transparent?: boolean;
} & GroupProps;

export function Image(props: ImageProps) {
  const {
    src,
    size = 1,
    framed,
    frameMaterial,
    frameWidth = 1,
    innerFrameMaterial,
    transparent,
  } = props;

  const modUrl = src.toLowerCase();
  const IS_KTX2 = modUrl.endsWith(".ktx2");
  const IS_JPEG_PNG =
    modUrl.endsWith(".jpg") ||
    modUrl.endsWith(".jpeg") ||
    modUrl.endsWith(".png");

  return (
    <Suspense fallback={null}>
      {IS_JPEG_PNG && <JpegPng {...props} />}
      {IS_KTX2 && <KTX2 {...props} />}
    </Suspense>
  );
}
