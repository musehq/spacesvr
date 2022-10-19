import { useEffect, useState } from "react";
import {
  StandardReality,
  Interactable,
  Image,
  Video,
  TextInput,
  Switch,
  LostWorld,
} from "spacesvr";
import Title from "../ideas/Title";
import Link from "../ideas/Link";
import Analytics from "../ideas/Analytics";

export default function Workshop() {
  const [value, setValue] = useState("hello world");

  useEffect(() => {
    if (value === "rand") {
      setValue(Math.random().toString());
    }
  }, [value]);

  const [url, setUrl] = useState(
    "https://dwvo2npct47gg.cloudfront.net/gallery/bladi/IMG_8334.jpg"
  );

  const [size, setSize] = useState(1);

  useEffect(() => {
    setTimeout(
      () =>
        setUrl(
          "https://muse-worlds.s3.us-west-1.amazonaws.com/1d7d3517-d168-4654-8bf8-466bf3369874/assets/bd4a336a-ad58-477b-89b7-1b764a058390/1d7d3517-d168-4654-8bf8-466bf3369874_assets_8c1a0efe-699d-4549-9347-76e307e42066_94a48aaf-6cd1-4c37-a0cc-fc70ee955a76_assets_86616231-19ec-4281-9122-14f12909166b_Screen%2BShot%2B2021-07-13%2Bat%2B5.49.37%2BPM.png"
        ),
      5000
    );
  }, []);

  const [hovering, setHovering] = useState(false);

  return (
    <StandardReality>
      <Analytics />
      <LostWorld />
      <group position-z={-2} position-x={-1}>
        <Title position-y={1.2}>welcome to the workshop</Title>
        <Link href="/" position-y={0.8}>
          back to the hub
        </Link>
      </group>
      <group position-x={-6} position-z={-3}>
        <mesh position-y={0.5}>
          <boxBufferGeometry args={[1, 1, 1]} />
          <meshNormalMaterial />
        </mesh>
        <Interactable
          onHover={() => setHovering(true)}
          onUnHover={() => setHovering(false)}
          onClick={() => setSize(Math.random() + 1)}
        >
          <mesh position={[2, 0.5, 0]}>
            <boxBufferGeometry args={[size, size * 0.25, size * 0.1]} />
            <meshStandardMaterial color={hovering ? "red" : "blue"} />
          </mesh>
        </Interactable>
      </group>
      <Image
        src={url}
        size={3}
        position={[-4.5, 2, 6.4]}
        rotation={[0, Math.PI, 0]}
        framed
      />
      <Image
        src="https://d1htv66kutdwsl.cloudfront.net/ff3aff8a-b3f9-4325-a274-d4ba44676bab/7f386117-5837-4d34-926c-f00ffa56c833.ktx2"
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
      />
      <Image
        src="https://d1htv66kutdwsl.cloudfront.net/e7edec86-52b6-4734-9c43-ffd70bc5bef6/9d1e5c18-3fb5-4844-8b31-1a08b800976e.ktx2"
        position={[-12.5, 2, 6.4]}
        rotation={[0, Math.PI, 0]}
        framed
      />
      <Image
        src="https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/I9vI-RoNmD7W.png"
        position={[-14, 2, 6.4]}
        rotation={[0, Math.PI, 0]}
        framed
      />
      <group position={[1, 0.9, -5.5]}>
        <TextInput
          placeholder="First Name"
          font="https://d27rt3a60hh1lx.cloudfront.net/fonts/custom-branding/FridgeChisel-Regular_lowerUppercase.otf"
          fontSize={0.1}
          width={1}
          value={value}
          onChange={setValue}
          onBlur={() => console.log("blur!")}
          onFocus={() => console.log("focus!")}
        />
        <TextInput
          position-x={1.1}
          type="password"
          placeholder="password"
          fontSize={0.1}
          width={1}
        />
        <TextInput
          position-x={2.2}
          placeholder="email"
          fontSize={0.1}
          width={1}
        />
        <TextInput
          position-x={3.3}
          type="number"
          placeholder="number"
          fontSize={0.175}
          onChange={(s) => console.log(s)}
          width={1}
        />
        <Switch position={[1, -0.3, 0]} onChange={(b) => console.log(b)} />
      </group>
      <Image
        name="outside-eddie"
        src="https://d27rt3a60hh1lx.cloudfront.net/content/muse.place/jasonmatias/EddieWave.jpg"
        framed
        frameWidth={0.75}
        size={12}
        rotation-y={0}
        position={[-1.4, 1.5, -12]}
      />
      <Video
        src="https://dwvo2npct47gg.cloudfront.net/videos/AWGEDVD-final.mp4"
        size={4}
        position={[0, 2.425, 3.076]}
        rotation={[0, -Math.PI, 0]}
        muted
      />
    </StandardReality>
  );
}
