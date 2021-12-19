import { Vector3 } from "three";
import { useEffect } from "react";
import {
  StandardEnvironment,
  Background,
  Logo,
  Image,
  usePlayer,
} from "spacesvr";
import Building from "../models/Building";
import MichaelModel from "../models/MichaelModel";
import PinkWhiteDurag from "../models/PinkWhiteDurag";
import ShoppingCart from "../models/ShoppingCart";
import { Ramp, Block } from "../components/Physics";

export default () => {
  return (
    <StandardEnvironment playerProps={{ pos: [0, 1, 5], rot: 0.9 }}>
      <Background color={0xffffff} />
      <Logo floating rotating position={new Vector3(0, 1.25, 0)} />
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
      <Building position={[4, 0, 0]} />
      <MichaelModel position={[2, 0, 0]} scale={[5, 5, 5]} />
      <PinkWhiteDurag position={[9, 0, 0]} scale={[5, 5, 5]} />
      <ShoppingCart position={[-6, 0, 0]} />
      <Ramp />
      <Block />
      <MovementTest />
    </StandardEnvironment>
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
