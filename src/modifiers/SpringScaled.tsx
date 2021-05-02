import { useFrame } from "@react-three/fiber";
import { ReactNode, useRef } from "react";
import { AnimatedValue } from "react-spring";
import { getSpringValues } from "../core/utils/spring";

type SpringScaledProps = {
  spring: AnimatedValue<any>;
  children: ReactNode;
};

/**
 * Given a spring will scale the group. Format expected is XYZS
 *
 * @param props
 * @constructor
 */
export function SpringScaled(props: SpringScaledProps) {
  const { spring, children } = props;

  const group = useRef<THREE.Group>();

  useFrame(() => {
    if (group?.current) {
      const [x, y, z, s] = getSpringValues(spring);
      group.current.scale.set(s, s, s);
    }
  });

  return <group ref={group}>{children}</group>;
}
