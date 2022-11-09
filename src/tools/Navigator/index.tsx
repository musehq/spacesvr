import { Tool } from "../../ideas/modifiers/Tool";
import { RoundedBox } from "@react-three/drei";
import { Image } from "../../ideas/media/Image";

export function NavigatorTool() {
  const TOOL_NAME = "Navigator";

  const LOGO_URL =
    "https://d27rt3a60hh1lx.cloudfront.net/images/muselogogray.png";

  return (
    <Tool name={TOOL_NAME} pos={[-0.7, -0.7]} orderIndex={0} face>
      <RoundedBox
        position-z={-0.075 / 2 - 0.001}
        args={[0.3, 0.6, 0.075]}
        radius={Math.min(0.3, 0.6, 0.075) * 0.5}
      >
        <meshStandardMaterial color="#fae0fd" />
      </RoundedBox>
      <Image src={LOGO_URL} size={0.15} />
    </Tool>
  );
}
