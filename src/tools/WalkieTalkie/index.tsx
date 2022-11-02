import { Tool } from "../../ideas/modifiers/Tool";

export default function WalkieTalkie() {
  const TOOL_NAME = "Walkie Talie";

  return (
    <Tool name={TOOL_NAME} keymap="u" pos={[0, 0]} distance={1}>
      <mesh>
        <boxBufferGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </Tool>
  );
}
