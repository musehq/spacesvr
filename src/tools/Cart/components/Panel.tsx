import { RoundedBox } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import React from "react";

type PanelProps = {
  open: boolean;
};

export default function Panel(props: PanelProps) {
  const { open } = props;

  const { scale } = useSpring({ scale: open ? 1 : 0 });

  return (
    <a.group scale={scale}>
      <RoundedBox args={[0.8, 0.6, 0.1]} radius={0.025} position-y={-0.4}>
        <meshStandardMaterial color="#cbcbcb" />
      </RoundedBox>
    </a.group>
  );
}
