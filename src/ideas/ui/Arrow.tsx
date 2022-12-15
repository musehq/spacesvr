import { GroupProps } from "@react-three/fiber";
import { useImage } from "../../logic/assets";
import { cache } from "../../logic";
import { MeshStandardMaterial } from "three";

type ArrowProps = { dark?: boolean } & GroupProps;

const IMAGE_SRC = "https://d27rt3a60hh1lx.cloudfront.net/images/whiteArrow.png";
const IMAGE_SRC_DARK =
  "https://d27rt3a60hh1lx.cloudfront.net/images/blackArrow.png";

export function Arrow(props: ArrowProps) {
  const { dark, ...rest } = props;

  const texture = useImage(dark ? IMAGE_SRC_DARK : IMAGE_SRC);

  const arrowMat = cache.useResource(
    `spacesvr_arrow_${dark ? "dark" : "light"}`,
    () =>
      new MeshStandardMaterial({
        map: texture,
        alphaTest: 0.5,
        transparent: true,
      })
  );

  return (
    <group name="spacesvr-arrow" {...rest}>
      <mesh scale={0.004} material={arrowMat}>
        <planeBufferGeometry args={[98, 51]} />
      </mesh>
    </group>
  );
}
