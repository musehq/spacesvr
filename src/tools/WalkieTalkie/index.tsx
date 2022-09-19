import { Tool } from "../../ideas/modifiers/Tool";

export default function WalkieTalkie() {
  const TOOL_NAME = "Walkie Talie";

  return (
    <Tool name={TOOL_NAME} keymap="u" pos={[0, 0]}>
      <mesh scale={4}>
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </Tool>
  );
}
