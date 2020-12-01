import { Vector3 } from "three";
import { KeyframeEnvironment, Background, Logo, Fog } from "spacesvr";

export default () => {
  const keyframes = [
    {
      label: "Start",
      position: new Vector3(2, 1, 0),
    },
    {
      label: "Planet View",
      position: new Vector3(2, 1.25, 0),
    },
    {
      label: "Around the corner",
      position: new Vector3(0, 0.75, 1),
    },
    {
      label: "So Tiny",
      position: new Vector3(0, 0.755, 1),
    },
  ];

  return (
    <KeyframeEnvironment keyframes={keyframes}>
      <Background color={0xffffff} />
      <Logo floating rotating position={new Vector3(0, 1.25, 0)} />
      <Fog color={0xffffff} near={10} far={90} />
      <ambientLight />
      <mesh rotation-x={-Math.PI / 2}>
        <planeBufferGeometry args={[200, 200]} />
        <meshBasicMaterial color={"purple"} />
      </mesh>
    </KeyframeEnvironment>
  );
};
