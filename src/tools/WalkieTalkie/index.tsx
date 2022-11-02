import { Tool } from "../../ideas/modifiers/Tool";
import { RoundedBox } from "@react-three/drei";

export default function WalkieTalkie() {
  const TOOL_NAME = "Walkie Talie";

  return (
    <Tool name={TOOL_NAME} keymap="u" pos={[0, 0]} distance={1}>
      <RoundedBox
        args={[0.35, 0.75, 0.1]}
        radius={Math.min(0.25, 0.75, 0.1) * 0.5}
      >
        <meshStandardMaterial color="#cbcbcb" />
      </RoundedBox>
    </Tool>
  );
}
