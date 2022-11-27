import { ReactNode, useRef } from "react";
import { Group } from "three";
import { useLimitedFrame } from "../../logic/limiter";

type FloatingProps = {
  height?: number;
  speed?: number;
  children: ReactNode | ReactNode[];
};

export function Floating(props: FloatingProps) {
  const { children, height = 0.2, speed = 1 } = props;

  const group = useRef<Group>(null);
  const seed = useRef(Math.random());

  useLimitedFrame(75, ({ clock }) => {
    if (!group.current) return;

    group.current.position.y =
      height * Math.sin(clock.elapsedTime * speed * 0.4 + seed.current * 10000);
  });

  return (
    <group name="spacesvr-floating" ref={group}>
      {children}
    </group>
  );
}
