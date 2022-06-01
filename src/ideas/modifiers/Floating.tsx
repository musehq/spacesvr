import { ReactNode, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { useLimiter } from "../../logic/limiter";

type FloatingProps = {
  height?: number;
  speed?: number;
  children: ReactNode | ReactNode[];
};

export function Floating(props: FloatingProps) {
  const { children, height = 0.2, speed = 1 } = props;

  const group = useRef<Group>();
  const seed = useRef(Math.random());
  const limiter = useLimiter(75);

  useFrame(({ clock }) => {
    if (!group.current || !limiter.isReady(clock)) return;

    group.current.position.y =
      height *
      Math.sin(clock.getElapsedTime() * speed * 0.4 + seed.current * 10000);
  });

  return (
    <group name="spacesvr-floating" ref={group}>
      {children}
    </group>
  );
}
