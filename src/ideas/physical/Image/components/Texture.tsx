import { useMemo } from "react";
import { DoubleSide, Material } from "three";
import { Frame } from "../../Frame";
import { useTexture } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";

type TextureProps = {
  src: string;
  size?: number;
  framed?: boolean;
  frameMaterial?: Material;
  frameWidth?: number;
  innerFrameMaterial?: Material;
  transparent?: boolean;
} & GroupProps;

function UnsuspensedTexture(props: TextureProps) {
  const {
    src,
    size = 1,
    framed,
    frameMaterial,
    frameWidth = 1,
    innerFrameMaterial,
    transparent,
  } = props;

  const texture = useTexture(src);

  const width = useMemo(() => texture.image.width, [texture]);
  const height = useMemo(() => texture.image.height, [texture]);

  const max = Math.max(width, height);
  const WIDTH = (width / max) * size,
    HEIGHT = (height / max) * size;

  return (
    <group name="spacesvr-texture" {...props}>
      <mesh>
        <planeBufferGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial
          map={texture}
          side={DoubleSide}
          transparent={transparent}
        />
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

export function Texture(props: TextureProps) {
  return <UnsuspensedTexture {...props} />;
}
