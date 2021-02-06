import { Vector3 } from "three";
import { StandardEnvironment, Background, Idea, Interactable } from "spacesvr";

const handleClick = () => console.log("got a click!");

export default () => {
  return (
    <StandardEnvironment player={{ pos: new Vector3(5, 1, 0), rot: Math.PI }}>
      <Background color={0xffffff} />
      <Interactable onClick={handleClick}>
        <Idea />
      </Interactable>
      <fog attach="fog" args={[0xffffff, 10, 90]} />
      <ambientLight />
      <pointLight position={[0, 10, 0]} />
      <mesh rotation-x={-Math.PI / 2}>
        <planeBufferGeometry args={[200, 200]} />
        <meshBasicMaterial color={"purple"} />
      </mesh>
    </StandardEnvironment>
  );
};
