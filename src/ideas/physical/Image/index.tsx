import { Suspense } from "react";
import { ImageTexture } from "./components/ImageTexture";
import { KTX2Texture } from "./components/KTX2Texture";
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
  const { src } = props;

  const IS_KTX2 = src.toLowerCase().endsWith(".ktx2");

  return (
    <Suspense fallback={null}>
      {IS_KTX2 ? <KTX2Texture {...props} /> : <ImageTexture {...props} />}
    </Suspense>
  );
}
