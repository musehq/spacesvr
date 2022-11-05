import { a, useSpring } from "@react-spring/three";
import { RoundedBox } from "@react-three/drei";
import React from "react";
import { Interactable } from "../../../ideas";

type IconProps = {
  open: boolean;
  setOpen: (o: boolean) => void;
};

export default function Icon(props: IconProps) {
  const { open, setOpen } = props;

  const { scale } = useSpring({ scale: open ? 0.5 : 1 });

  return (
    <Interactable onClick={() => setOpen(!open)}>
      <a.group scale={scale}>
        <RoundedBox args={[0.2, 0.2, 0.2]} radius={0.05}>
          <meshStandardMaterial color="#cbcbcb" />
        </RoundedBox>
      </a.group>
    </Interactable>
  );
}
