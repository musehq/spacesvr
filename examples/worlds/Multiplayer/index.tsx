import { StandardReality, Background, Model } from "spacesvr";
import LightSwitch from "./ideas/LightSwitch";
import PingPongMulti from "./ideas/PingPongMulti";

export default function Multiplayer() {
  return (
    <StandardReality
      playerProps={{ pos: [5, 1, 0], rot: Math.PI }}
      networkProps={{ autoconnect: true, voice: true }}
    >
      {/*<PingPongMulti />*/}
      <Background color={0xffffff} />
      <fog attach="fog" args={[0xffffff, 10, 90]} />
      <ambientLight />
      <LightSwitch position={[0.5, 1, -2.5]} />
      <mesh rotation-x={-Math.PI / 2}>
        <planeBufferGeometry args={[200, 200]} />
        <meshBasicMaterial color={"purple"} />
      </mesh>
      <Model src="https://d27rt3a60hh1lx.cloudfront.net/models/Camera-1652915410/camera_02_cleaned.glb.gz" />
    </StandardReality>
  );
}
