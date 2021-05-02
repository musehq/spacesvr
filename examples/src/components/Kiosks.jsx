import { Suspense } from "react";
import { Spinning } from "spacesvr";
import Kiosk from "./Kiosk";

export default function Kiosks() {
  return (
    <group name="kiosks" position={[2, 0.65, 4]} rotation-y={-Math.PI / 2}>
      <Kiosk
        position-x={-0.75}
        productId="Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY2MjEwNTg4OTE5NDQ="
        name="ghost"
      >
        <Spinning>
          <Suspense fallback={null}></Suspense>
        </Spinning>
      </Kiosk>
      <Kiosk
        position-x={0}
        productId="Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY2MjEwODgyMTkzMDQ="
        name="moneycat"
      >
        <Spinning>
          <Suspense fallback={null}></Suspense>
        </Spinning>
      </Kiosk>
      <Kiosk
        position-x={0.75}
        productId="Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzY2MjEwNDQ0NDEyNTY="
        name="moneycat"
      >
        <Spinning>
          <Suspense fallback={null}></Suspense>
        </Spinning>
      </Kiosk>
    </group>
  );
}
