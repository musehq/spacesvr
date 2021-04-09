import { ReactNode, useRef, useState } from "react";
import { Group } from "three";
import { useFrame } from "react-three-fiber";
import { useLimiter } from "../services/limiter";

type Props = {
  children: ReactNode;
  xSpeed?: number;
  ySpeed?: number;
  zSpeed?: number;
};

export const Spinning = (props: Props) => {
  const { children, xSpeed = 0, ySpeed = 1, zSpeed = 0 } = props;

  const group = useRef<Group>();
  const [seed] = useState(Math.random());
  const limiter = useLimiter(75);

  useFrame(({ clock }) => {
    if (!group.current || !limiter.isReady(clock)) return;

    group.current.rotation.x =
      clock.getElapsedTime() * xSpeed * 0.25 + xSpeed * seed * 100;
    group.current.rotation.y =
      clock.getElapsedTime() * ySpeed * (0.25 + seed / 10) +
      ySpeed * seed * 1000;
    group.current.rotation.z =
      clock.getElapsedTime() * zSpeed * 0.25 + zSpeed * seed * 40;
  });

  return <group ref={group}>{children}</group>;
};
