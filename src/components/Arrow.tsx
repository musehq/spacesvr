import { useLoader } from "react-three-fiber";
import * as THREE from "three";

type ArrowProps = { dark?: boolean } & JSX.IntrinsicElements["group"];

const IMAGE_SRC = "https://d27rt3a60hh1lx.cloudfront.net/images/whiteArrow.png";
const IMAGE_SRC_DARK =
  "https://d27rt3a60hh1lx.cloudfront.net/images/blackArrow.png";

export const Arrow = (props: ArrowProps) => {
  const { dark, ...restProps } = props;

  const texture = useLoader(
    THREE.TextureLoader,
    dark ? IMAGE_SRC_DARK : IMAGE_SRC
  );

  return (
    <group {...restProps}>
      <mesh scale={[0.004, 0.004, 0.004]}>
        <planeBufferGeometry attach="geometry" args={[98, 51]} />
        <meshStandardMaterial
          map={texture}
          attach="material"
          alphaTest={0.5}
          transparent={true}
          normalMap={texture}
        />
      </mesh>
    </group>
  );
};
