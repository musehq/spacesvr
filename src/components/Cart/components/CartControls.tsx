import { Text } from "@react-three/drei";
import { isMobile } from "react-device-detect";
import { useContext } from "react";
import FacePlayer from "../../../modifiers/FacePlayer";
import { ShopContext } from "../../../core/contexts";

export default function Control() {
  const { cart } = useContext(ShopContext);

  const numScale = isMobile ? 0.9 : 1;
  const numY = isMobile ? -1.25 : 6;

  const cartStatus =
    cart && cart.count > 0
      ? `${cart.count} Item${cart.count > 1 ? "s" : ""}`
      : "Cart Is Empty";
  const cartPanelWidth = Math.max(4, cartStatus.length * 0.5);
  const instructions = isMobile ? "tap to clear" : "press 'c' to clear";

  return (
    <group position={[0, numY, 0]}>
      <group scale={[numScale, numScale, numScale]}>
        <FacePlayer>
          <mesh position={[0, 0.3, -0.05]}>
            <planeBufferGeometry args={[cartPanelWidth, 2.5]} />
            <meshStandardMaterial color="red" transparent opacity={0.8} />
          </mesh>
          {/* @ts-ignore */}
          <Text fontSize={0.9} position-y={0.15} anchorY={"bottom"}>
            {cartStatus}
          </Text>
          {/* @ts-ignore */}
          <Text fontSize={0.5} position-y={0.2} anchorY="top">
            {cart?.count == 0 ? "" : instructions}
          </Text>
        </FacePlayer>
      </group>
    </group>
  );
}
