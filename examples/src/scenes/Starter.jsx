import { useEffect, useState } from "react";
import { Vector3 } from "three";
import * as THREE from "three";

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
    <StandardEnvironment signup="https://bit.ly/3wgMNGO">
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
        position={[-6.5, 2, 6.4]}
        rotation={[0, Math.PI, 0]}
        framed
      />
      <Image
        src="https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/I9vI-RoNmD7W.png"
        position={[-9.5, 2, 6.4]}
        rotation={[0, Math.PI, 0]}
      />
      <Image
        src="https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/I9vI-RoNmD7W.png"
        position={[-8, 2, 6.4]}
        rotation={[0, Math.PI, 0]}
        framed
      />
      <Image
        src="https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/I9vI-RoNmD7W.png"
        position={[-11, 2, 6.4]}
        rotation={[0, Math.PI, 0]}
        innerFrameTransparent
      />
      <Image
        src="https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/I9vI-RoNmD7W.png"
        position={[-12.5, 2, 6.4]}
        rotation={[0, Math.PI, 0]}
        framed
        innerFrameTransparent
      />
      <Image
        src="https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/I9vI-RoNmD7W.png"
        position={[-14, 2, 6.4]}
        rotation={[0, Math.PI, 0]}
        framed
        innerFrameTransparent
        innerFrameMaterial={
          new THREE.MeshStandardMaterial({
            color: 0x000000,
            roughness: 0.8,
            metalness: 0.05,
          })
        }
      />
      {/* <Image
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
      /> */}
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
