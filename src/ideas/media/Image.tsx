import { Suspense } from "react";
import { CompressedTexture, DoubleSide, Material } from "three";
import { GroupProps } from "@react-three/fiber";
import { useImage } from "../../logic/assets";
import { Frame } from "../mediated/Frame";

type ImageProps = {
  src: string;
  size?: number;
  framed?: boolean;
  frameMaterial?: Material;
  frameWidth?: number;
  innerFrameMaterial?: Material;
} & GroupProps;

function UnsuspensedImage(props: ImageProps) {
  const {
    src,
    size = 1,
    framed,
    frameMaterial,
    frameWidth = 1,
    innerFrameMaterial,
    ...rest
  } = props;

  const tex = useImage(src);

  const { width, height } = tex.image;
  const max = Math.max(width, height);

  const WIDTH = (width / max) * size;
  const HEIGHT = (height / max) * size;
  const IS_COMPRESSED = (tex as CompressedTexture).isCompressedTexture;

  return (
    <group name="spacesvr-image" {...rest}>
      <mesh rotation={IS_COMPRESSED ? [0, Math.PI, Math.PI] : [0, 0, 0]}>
        <planeBufferGeometry args={[WIDTH, HEIGHT]} />
        <meshStandardMaterial map={tex} side={DoubleSide} transparent />
      </mesh>
      {framed && (
        <Frame
          width={WIDTH}
          height={HEIGHT}
          thickness={frameWidth}
          material={frameMaterial}
          innerFrameMaterial={innerFrameMaterial}
        />
      )}
    </group>
  );
}

export function Image(props: ImageProps) {
  return (
    <Suspense fallback={null}>
      <UnsuspensedImage {...props} />
    </Suspense>
  );
}
