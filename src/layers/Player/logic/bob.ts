import { config, useSpring } from "@react-spring/three";
import { useFrame, useThree } from "@react-three/fiber";
import { MutableRefObject } from "react";
import { Clock, Vector3 } from "three";

export const useBob = (direction: MutableRefObject<Vector3>) => {
  const camera = useThree((st) => st.camera);

  const { bob } = useSpring({ bob: 0, config: config.default });

  const update = (clock: Clock) => {
    const IS_MOVING = direction.current.length() > 0.1;
    bob.set(IS_MOVING ? 1 : 0);
    const amt = bob.get();
    camera.position.y += Math.sin(clock.getElapsedTime() * 20) * 0.0055 * amt;
    camera.position.x +=
      Math.cos(clock.getElapsedTime() * 15 + 0.3) * 0.002 * amt;
  };

  return { update };
};
