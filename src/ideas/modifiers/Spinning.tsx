import { ReactNode, useRef, useState } from "react";
import { Group } from "three";
import { useLimitedFrame } from "../../logic/limiter";

type Props = {
  children: ReactNode;
  xSpeed?: number;
  ySpeed?: number;
  zSpeed?: number;
};

export function Spinning(props: Props) {
  const { children, xSpeed = 0, ySpeed = 1, zSpeed = 0 } = props;

  const group = useRef<Group>(null);
  const [seed] = useState(Math.random());

  useLimitedFrame(75, ({ clock }) => {
    if (!group.current) return;

    group.current.rotation.x =
      clock.elapsedTime * xSpeed * 0.25 + xSpeed * seed * 100;
    group.current.rotation.y =
      clock.elapsedTime * ySpeed * (0.25 + seed / 10) + ySpeed * seed * 1000;
    group.current.rotation.z =
      clock.elapsedTime * zSpeed * 0.25 + zSpeed * seed * 40;
  });

  return (
    <group name="spacesvr-spinning" ref={group}>
      {children}
    </group>
  );
}
