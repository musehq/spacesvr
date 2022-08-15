import { useMemo } from "react";
import { DoubleSide } from "three";
import { Frame } from "../../Frame";
import { useKTX2 } from "@react-three/drei";
import { ImageProps } from "../index";

export function KTX2Texture(props: ImageProps) {
  const {
    src,
    size = 1,
    framed,
    frameMaterial,
    frameWidth = 1,
    innerFrameMaterial,
    transparent,
  } = props;

  const texture = useKTX2(src);

  const width = useMemo(() => texture.image.width, [texture]);
  const height = useMemo(() => texture.image.height, [texture]);

  const max = Math.max(width, height);
  const WIDTH = (width / max) * size,
    HEIGHT = (height / max) * size;

  return (
    <group name="spacesvr-ktx2" {...props}>
      <mesh rotation={[0, Math.PI, Math.PI]}>
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
