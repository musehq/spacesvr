import { ReactNode, useRef } from "react";
import { useFrame } from "react-three-fiber";
import { Group } from "three";

type FloatingProps = {
  height?: number;
  speed?: 1;
  children: ReactNode;
};

const Floating = (props: FloatingProps) => {
  const { children, height = 0.2, speed = 1 } = props;

  const group = useRef<Group>();
  const seed = useRef(Math.random());

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.position.y =
        height *
        Math.sin(clock.getElapsedTime() * speed * 0.4 + seed.current * 10000);
    }
  });

  return <group ref={group}>{children}</group>;
};

export default Floating;
