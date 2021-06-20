import { Suspense } from "react";
import { Spinning } from "spacesvr";
import Kiosk from "./Kiosk";
import PinkWhiteDurag from "../models/PinkWhiteDurag";
import ShoppingCart from "../models/ShoppingCart";

export default function Kiosks() {
  return (
    <group name="kiosks" position={[2, 0.65, 4]}>
      <group position-x={-3.75} name="idea2">
        <Spinning>
          <Suspense fallback={null}>
            <PinkWhiteDurag />
          </Suspense>
        </Spinning>
      </group>
      <group position-x={0} name="idea1">
        <Spinning>
          <Suspense fallback={null}>
            <ShoppingCart />
          </Suspense>
        </Spinning>
      </group>
    </group>
  );
}
