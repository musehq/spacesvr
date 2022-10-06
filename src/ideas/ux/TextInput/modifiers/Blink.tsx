import { ReactNode, useRef } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";

type BlinkProps = {
  rate?: number;
  children: ReactNode | ReactNode[];
};

export default function Blink(props: BlinkProps) {
  const { rate = 1, children } = props;

  const group = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.visible = Boolean(
      Math.round(
        (Math.sin(rate * Math.PI * 2 * clock.getElapsedTime()) + 1) / 2
      )
    );
  });

  return (
    <group name="spacesvr-blink" ref={group}>
      {children}
    </group>
  );
}
