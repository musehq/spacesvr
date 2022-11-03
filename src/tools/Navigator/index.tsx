import { Tool } from "../../ideas/modifiers/Tool";
import { RoundedBox } from "@react-three/drei";

export default function NavigatorTool() {
  const TOOL_NAME = "Navigator";

  return (
    <Tool name={TOOL_NAME} keymap="n" pos={[0, 0]}>
      <RoundedBox
        args={[0.35, 0.75, 0.1]}
        radius={Math.min(0.25, 0.75, 0.1) * 0.5}
      >
        <meshStandardMaterial color="purple" />
      </RoundedBox>
    </Tool>
  );
}
