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
  const [url, setUrl] = useState(
    "https://dwvo2npct47gg.cloudfront.net/gallery/bladi/IMG_8334.jpg"
  );

  useEffect(() => {
    setTimeout(
      () =>
        setUrl(
          "https://muse-worlds.s3.us-west-1.amazonaws.com/1d7d3517-d168-4654-8bf8-466bf3369874/assets/bd4a336a-ad58-477b-89b7-1b764a058390/1d7d3517-d168-4654-8bf8-466bf3369874_assets_8c1a0efe-699d-4549-9347-76e307e42066_94a48aaf-6cd1-4c37-a0cc-fc70ee955a76_assets_86616231-19ec-4281-9122-14f12909166b_Screen%2BShot%2B2021-07-13%2Bat%2B5.49.37%2BPM.png"
        ),
      5000
    );
  }, []);

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
      <mesh position-y={0.5} position-x={3}>
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshNormalMaterial />
      </mesh>
      <Audio url="https://d27rt3a60hh1lx.cloudfront.net/content/muse.place/whoisabnel/dark.mp3" />
      <Image
        src={url}
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
        transparent
      />
      <Image
        src="https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/I9vI-RoNmD7W.png"
        position={[-12.5, 2, 6.4]}
        rotation={[0, Math.PI, 0]}
        framed
        transparent
      />
      <Image
        src="https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/I9vI-RoNmD7W.png"
        position={[-14, 2, 6.4]}
        rotation={[0, Math.PI, 0]}
        framed
        transparent
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
