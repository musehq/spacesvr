import { VisualEffect } from "spacesvr";
import { UnrealBloomPass } from "three-stdlib";
import { extend, ReactThreeFiber } from "@react-three/fiber";
import { useState } from "react";
import { Vector2 } from "three";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      unrealBloomPass: ReactThreeFiber.Node<
        UnrealBloomPass,
        typeof UnrealBloomPass
      >;
    }
  }
}

extend({ UnrealBloomPass });

export default function Bloom() {
  const [res] = useState(() => new Vector2(256, 256));

  return (
    <VisualEffect index={1}>
      <unrealBloomPass args={[res, 0.2, 0.01, 0.95]} />
    </VisualEffect>
  );
}
