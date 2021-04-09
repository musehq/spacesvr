import { Vector3 } from "three";
import { StandardEnvironment, Background, Logo, Image, Audio } from "spacesvr";
import Building from "../models/Building";
import MichaelModel from "../models/MichaelModel";
import PinkWhiteDurag from "../models/PinkWhiteDurag";
import ShoppingCart from "../models/ShoppingCart";

export default () => {
  const assets = [
    "https://dwvo2npct47gg.cloudfront.net/gallery/bladi/IMG_8334.jpg",
    "https://d27rt3a60hh1lx.cloudfront.net/models/C2ABuilding-1613786912/building.glb",
    "https://dwvo2npct47gg.cloudfront.net/gallery/bladi/IMG_8333.asdfasd",
    "https://d27rt3a60hh1lx.cloudfront.net/models/Michael-1613184104/michael1.glb",
    "https://d27rt3a60hh1lx.cloudfront.net/models/PinkWhiteDurag-1613279207/pinkwhitedurag5.glb",
    "https://d27rt3a60hh1lx.cloudfront.net/models/ShoppingCart-1613286474/cart2.glb",
  ];

  return (
    <StandardEnvironment player={{ pos: new Vector3(5, 1, 0), rot: Math.PI }}>
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
    </StandardEnvironment>
  );
};
