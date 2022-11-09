import { Tool } from "../../ideas/modifiers/Tool";
import { RoundedBox } from "@react-three/drei";

export function WalkieTalkie() {
  const TOOL_NAME = "Walkie Talkie";

  return (
    <Tool name={TOOL_NAME} pos={[0, 0]} range={0.3}>
      <RoundedBox
        args={[0.35, 0.75, 0.1]}
        radius={Math.min(0.25, 0.75, 0.1) * 0.5}
      >
        <meshStandardMaterial color="#cbcbcb" />
      </RoundedBox>
    </Tool>
  );
}
