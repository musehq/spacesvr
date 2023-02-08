import { StandardReality, Background, Model, Camera } from "spacesvr";
import LightSwitch from "./ideas/LightSwitch";
import PingPongMulti from "./ideas/PingPongMulti";
import Title from "../../ideas/Title";
import Link from "../../ideas/Link";
import Analytics from "../../ideas/Analytics";

export default function Multiplayer() {
  return (
    <StandardReality
      environmentProps={{ dev: process.env.NODE_ENV === "development" }}
      playerProps={{ pos: [5, 1, 0], rot: Math.PI }}
      networkProps={{ autoconnect: true, voice: true }}
      toolbeltProps={{ showOnSpawn: false }}
    >
      <Analytics />
      <Title position-z={-1.5} position-y={1.2}>
        welcome to the multiplayer world
      </Title>
      <Link href="/" position-z={-1.5} position-y={0.8}>
        back to the hub
      </Link>
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
      <Camera />
    </StandardReality>
  );
}
