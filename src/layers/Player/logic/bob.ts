import { config, useSpring } from "@react-spring/three";
import { useThree } from "@react-three/fiber";
import { MutableRefObject, useState } from "react";
import { Clock, Vector3 } from "three";

export const useBob = (
  velocity: MutableRefObject<Vector3>,
  direction: MutableRefObject<Vector3>
) => {
  const camera = useThree((st) => st.camera);

  const { bob } = useSpring({ bob: 0, config: config.default });

  const [offset] = useState(new Vector3());

  const update = (clock: Clock) => {
    const IS_MOVING = direction.current.length() > 0.1;
    const IS_GROUNDED = Math.abs(velocity.current.y) < 0.01;
    bob.set(IS_MOVING && IS_GROUNDED ? 1 : 0);
    const amt = bob.get();
    const y = Math.sin(clock.elapsedTime * 20) * 0.0055 * amt;
    const x = Math.cos(clock.elapsedTime * 15 + 0.3) * 0.002 * amt;
    offset.set(x, y, 0);
    offset.applyQuaternion(camera.quaternion);
    camera.position.add(offset);
  };

  return { update };
};
