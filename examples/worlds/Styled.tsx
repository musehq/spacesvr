import { StandardReality, Background, HDRI, Camera } from "spacesvr";

export default function Styled() {
  return (
    <StandardReality playerProps={{ pos: [5, 1, 0], rot: Math.PI }}>
      <Camera />
      <Background color={0xffffff} />
      <HDRI src="https://dwvo2npct47gg.cloudfront.net/hdr/SkyMural2.hdr" />
      <fog attach="fog" args={[0xffffff, 10, 90]} />
      <ambientLight />
      <mesh rotation-x={-Math.PI / 2}>
        <planeBufferGeometry args={[200, 200]} />
        <meshBasicMaterial color={"purple"} />
      </mesh>
    </StandardReality>
  );
}
