import { Suspense } from "react";
import { Texture } from "./components/Texture";
import { KTX2 } from "./components/KTX2";
import { Material } from "three";
import { GroupProps } from "@react-three/fiber";

export type ImageProps = {
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

  return (
    <Suspense fallback={null}>
      {IS_KTX2 ? <KTX2 {...props} /> : <Texture {...props} />}
    </Suspense>
  );
}
