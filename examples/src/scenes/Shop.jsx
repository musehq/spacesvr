import { useEffect, useState } from "react";
import { Vector3 } from "three";
import Kiosks from "../components/Kiosks";
import Building from "../models/Building";
import {
  StandardEnvironment,
  Background,
  Logo,
  Interactable,
  Shopify,
} from "spacesvr";

const handleClick = () => window.open("https://www.apple.com", "_blank");
export default () => {
  const [open, setOpen] = useState(false);
  const domain = "balloonski.myshopify.com",
    token = "149755cbbf5f79758937d9114964fda7";

  return (
    <StandardEnvironment player={{ pos: new Vector3(5, 1, 0), rot: Math.PI }}>
      <Shopify domain={domain} token={token}>
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
        <Kiosks />
      </Shopify>
    </StandardEnvironment>
  );
};
