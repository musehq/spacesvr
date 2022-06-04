import { StandardReality, Background } from "spacesvr";

export default () => {
  return (
    <StandardReality
      playerProps={{ pos: [5, 1, 0], rot: Math.PI }}
      networkedProps={{ host: "http://localhost:3005", autoconnect: false }}
    >
      <Background color={0xffffff} />
      <fog attach="fog" args={[0xffffff, 10, 90]} />
      <ambientLight />
      <mesh rotation-x={-Math.PI / 2}>
        <planeBufferGeometry args={[200, 200]} />
        <meshBasicMaterial color={"purple"} />
      </mesh>
    </StandardReality>
  );
};
