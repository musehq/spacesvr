import { useEffect, useState } from "react";
import { Vector3 } from "three";
import {
  StandardEnvironment,
  Background,
  Logo,
  Interactable,
  Audio,
  Image,
  Video,
} from "spacesvr";

const handleClick = () => window.open("https://www.apple.com", "_blank");
export default () => {
  const [open, setOpen] = useState(false);

  return (
    <StandardEnvironment dev>
      <Background color={0xffffff} />
      <Interactable
        onClick={handleClick}
        onHover={() => console.log("hover")}
        onUnHover={() => console.log("un hover")}
      >
        <Logo floating rotating position={new Vector3(0, 1.25, 0)} />
      </Interactable>
      <fog attach="fog" args={[0xffffff, 10, 90]} />
      <ambientLight />
      <mesh rotation-x={-Math.PI / 2}>
        <planeBufferGeometry args={[200, 200]} />
        <meshBasicMaterial color={"purple"} />
      </mesh>
      <Audio url="https://d27rt3a60hh1lx.cloudfront.net/content/muse.place/whoisabnel/dark.mp3" />
      <Image
        src="https://dwvo2npct47gg.cloudfront.net/gallery/bladi/IMG_8334.jpg"
        size={3}
        position={[-6, 2, 6.4]}
        rotation={[0, Math.PI, 0]}
        framed
      />
      <Image
        src="https://d27rt3a60hh1lx.cloudfront.net/textures/dream1-1621460174/dream1.ktx2"
        size={3}
        position={[-3, 2, 6.4]}
        rotation={[0, Math.PI, 0]}
        framed
      />
      <Image
        src="https://d27rt3a60hh1lx.cloudfront.net/textures/dream17-1621460188/dream17.ktx2"
        size={3}
        position={[0, 2, 6.4]}
        rotation={[0, Math.PI, 0]}
        framed
      />
      <Image
        name="outside-eddie"
        src="https://d27rt3a60hh1lx.cloudfront.net/content/muse.place/jasonmatias/EddieWave.jpg"
        framed
        frameWidth={0.75}
        size={12}
        rotation-y={0}
        position={[-1.4, 1.5, -12]}
      />
      {open && (
        <Video
          src="https://dwvo2npct47gg.cloudfront.net/videos/AWGEDVD-final.mp4"
          size={4}
          position={[0, 2.425, 3.076]}
          rotation={[0, -Math.PI, 0]}
        />
      )}
    </StandardEnvironment>
  );
};
