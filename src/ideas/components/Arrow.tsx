import { GroupProps, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

type ArrowProps = { dark?: boolean } & GroupProps;

const IMAGE_SRC = "https://d27rt3a60hh1lx.cloudfront.net/images/whiteArrow.png";
const IMAGE_SRC_DARK =
  "https://d27rt3a60hh1lx.cloudfront.net/images/blackArrow.png";

export function Arrow(props: ArrowProps) {
  const { dark, ...rest } = props;

  const texture = useLoader(TextureLoader, dark ? IMAGE_SRC_DARK : IMAGE_SRC);

  return (
    <group name="spacesvr-arrow" {...rest}>
      <mesh scale={0.004}>
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
}
