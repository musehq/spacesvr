import { Vector3 } from "three";
import {
  KeyframeEnvironment,
  Background,
  Logo,
  Fog,
  Text,
  Interactable,
} from "spacesvr";

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
  const handleClick = () => {
    console.log("click");
  };

  return (
    <KeyframeEnvironment keyframes={keyframes}>
      <Background color={0xffffff} />
      <Interactable onClick={handleClick}>
        <Logo floating rotating position={new Vector3(0, 1.25, 0)} />
      </Interactable>
      <Fog color={0xffffff} near={10} far={90} />
      <ambientLight />
      <mesh rotation-x={-Math.PI / 2}>
        <planeBufferGeometry args={[200, 200]} />
        <meshBasicMaterial color={"purple"} />
      </mesh>
      <Interactable onClick={() => console.log("hello!")}>
        <mesh position={[2, 1, 2]}>
          <boxBufferGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={"red"} />
        </mesh>
      </Interactable>
      <Text
        text="Click Me!"
        rotation-y={Math.PI}
        position={[2, 2, 2]}
        size={2}
      />
    </KeyframeEnvironment>
  );
};
