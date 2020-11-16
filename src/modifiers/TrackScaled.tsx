import { useFrame } from "react-three-fiber";
import { ReactNode, useRef } from "react";

type TrackScaledProps = {
  spring: any;
  children: ReactNode;
};

export const TrackScaled = (props: TrackScaledProps) => {
  const { spring, children } = props;

  const group = useRef<THREE.Group>();

  useFrame(() => {
    if (group?.current) {
      // @ts-ignore
      const newVals = spring.xyzs.interpolate((x, y, z, s) => [x, y, z, s]);
      // @ts-ignore
      const newS = newVals.payload[3].value;
      // @ts-ignore
      const sVel = newVals.payload[3].lastVelocity || 0;

      group.current.scale.set(newS, newS, newS);
    }
  });

  return <group ref={group}>{children}</group>;
};
