import { Vector3 } from "three";
import Kiosks from "../components/Kiosks";
import {
  StandardEnvironment,
  Background,
  Logo,
  Interactable,
  Shopify,
  Video,
  Image,
  EditMode,
} from "spacesvr";

const handleClick = () => window.open("https://www.apple.com", "_blank");
export default () => {
  const domain = "balloonski.myshopify.com",
    token = "149755cbbf5f79758937d9114964fda7";

  return (
    <StandardEnvironment dev>
      <EditMode>
        <Shopify domain={domain} token={token}>
          <Background color={0xffffff} />
          <Interactable onClick={handleClick}>
            <Logo
              floating
              rotating
              position={new Vector3(0, 2.5, 0)}
              name="idea5"
            />
          </Interactable>
          <fog attach="fog" args={[0xffffff, 10, 90]} />
          <ambientLight />
          <mesh rotation-x={-Math.PI / 2}>
            <planeBufferGeometry args={[200, 200]} />
            <meshBasicMaterial color={"purple"} />
          </mesh>
          <Kiosks />
          <Image
            src="https://dwvo2npct47gg.cloudfront.net/gallery/bladi/IMG_8334.jpg"
            size={3}
            position={[-6, 2, 6.4]}
            rotation={[0, Math.PI, 0]}
            framed
            name="idea4"
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
          <Video
            src="https://dwvo2npct47gg.cloudfront.net/videos/AWGEDVD-final.mp4"
            size={4}
            position={[0, 2.425, 3.076]}
            rotation={[0, -Math.PI, 0]}
            muted
            name="idea3"
          />
        </Shopify>
      </EditMode>
    </StandardEnvironment>
  );
};
