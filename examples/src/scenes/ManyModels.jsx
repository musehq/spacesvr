import { Vector3 } from "three";
import { useEffect } from "react";
import { StandardReality, Background, Image, usePlayer } from "spacesvr";
import { Ramp, Block } from "../components/Physics";

export default () => {
  return (
    <StandardReality playerProps={{ pos: [0, 1, 5], rot: 0.9 }}>
      <Background color={0xffffff} />
      <ambientLight />
      <pointLight position={[0, 20, 0]} />
      <fog attach="fog" args={[0xffffff, 10, 90]} />
      <mesh rotation-x={-Math.PI / 2}>
        <planeBufferGeometry args={[200, 200]} />
        <meshBasicMaterial color="blue" />
      </mesh>
      <Image
        src="https://dwvo2npct47gg.cloudfront.net/gallery/bladi/IMG_8334.jpg"
        size={3}
        position={[-6, 2, 6.4]}
        rotation={[0, Math.PI, 0]}
        framed
      />
      <Ramp />
      <Block />
      <MovementTest />
    </StandardReality>
  );
};

const MovementTest = () => {
  const player = usePlayer();

  useEffect(() => {
    const onKeyPress = (e) => {
      if (e.key.toLowerCase() === " ") {
        player.velocity.set(
          player.velocity
            .get()
            .add(new Vector3(Math.random() * 50, 4, Math.random() * 50))
        );
      }

      if (e.key.toLowerCase() === "t") {
        player.velocity.set(new Vector3());
      }
    };

    document.addEventListener("keypress", onKeyPress);
    return () => document.removeEventListener("keypress", onKeyPress);
  }, [player]);

  return null;
};
