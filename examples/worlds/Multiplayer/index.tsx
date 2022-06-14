import { StandardReality, Background } from "spacesvr";
import LightSwitch from "./ideas/LightSwitch";

export default function Multiplayer() {
  return (
    <StandardReality
      playerProps={{ pos: [5, 1, 0], rot: Math.PI }}
      networkProps={{ autoconnect: true }}
    >
      <Background color={0xffffff} />
      <fog attach="fog" args={[0xffffff, 10, 90]} />
      <ambientLight />
      <LightSwitch position={[0.5, 1, -2.5]} />
      <mesh rotation-x={-Math.PI / 2}>
        <planeBufferGeometry args={[200, 200]} />
        <meshBasicMaterial color={"purple"} />
      </mesh>
    </StandardReality>
  );
}
