import { Fog } from "../ideas/environment/Fog";
import { Background } from "../ideas/environment/Background";
import { LostFloor } from "../ideas/mediated/LostFloor";

export function LostWorld() {
  return (
    <group name="lost-world">
      <Fog color="white" near={0.1} far={15} />
      <directionalLight position-y={1} intensity={1.8} />
      <ambientLight intensity={1} />
      <Background color="white" />
      <LostFloor />
    </group>
  );
}
