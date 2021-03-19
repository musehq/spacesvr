import { Vector3 } from "three";
import { StandardEnvironment, Background, Logo } from "spacesvr";

export default () => {
  return (
    <StandardEnvironment
      player={{ pos: new Vector3(5, 1, 0), rot: Math.PI }}
      simulationProps={{
        signalHost: "52.52.46.59",
        signalPort: 80,
        signalPath: "/signal",
        socketServer: "ws://172.31.17.98:3002",
        frequency: 20,
      }}
    >
      <Background color={0xffffff} />
      <Logo floating rotating position={new Vector3(0, 1.25, 0)} />
      <fog attach="fog" args={[0xffffff, 10, 90]} />
      <ambientLight />
      <mesh rotation-x={-Math.PI / 2}>
        <planeBufferGeometry args={[200, 200]} />
        <meshBasicMaterial color={"purple"} />
      </mesh>
    </StandardEnvironment>
  );
};
