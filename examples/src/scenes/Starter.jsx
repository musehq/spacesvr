import { Vector3 } from "three";
import {
  StandardEnvironment,
  Background,
  Logo,
  Interactable,
  Video,
  Image,
} from "spacesvr";

const handleClick = () => window.open("https://www.apple.com", "_blank");
export default () => {
  return (
    <StandardEnvironment player={{ pos: new Vector3(5, 1, 0), rot: Math.PI }}>
      <Background color={0xffffff} />
      <Interactable onClick={handleClick}>
        <Logo floating rotating position={new Vector3(0, 1.25, 0)} />
      </Interactable>
      <fog attach="fog" args={[0xffffff, 10, 90]} />
      <ambientLight />
      <mesh rotation-x={-Math.PI / 2}>
        <planeBufferGeometry args={[200, 200]} />
        <meshBasicMaterial color={"purple"} />
      </mesh>
      <Video
        src="https://dwvo2npct47gg.cloudfront.net/videos/AWGEDVD-final.mp4"
        size={[640 / 100, 360 / 100]}
        position={[0, 2.425, 3.076]}
        rotation={[0, -Math.PI, 0]}
      />
      <Image
        src="https://dwvo2npct47gg.cloudfront.net/gallery/bladi/IMG_8333.jpg"
        size={[(1132 / 1500) * 3.2, 3.2]}
        position={[-6, 2, 6.4]}
        rotation={[0, Math.PI, 0]}
        framed
      />
    </StandardEnvironment>
  );
};
