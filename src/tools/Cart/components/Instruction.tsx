import { a, useSpring } from "@react-spring/three";
import { Text } from "@react-three/drei";
import React from "react";
import Key from "../../../ideas/ui/Key";
import { useEnvironment } from "../../../layers";

type InstructionProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function Instruction(props: InstructionProps) {
  const { open, setOpen } = props;

  const { device } = useEnvironment();

  const { scale } = useSpring({ scale: open ? 0 : 1 });

  return (
    <a.group
      scale={scale}
      position-x={0.1}
      position-y={device.desktop ? 0.3 : -0.2}
      rotation-x={0.1}
    >
      <mesh>
        <planeBufferGeometry args={[0.4, 0.1]} />
        <meshStandardMaterial color="black" transparent opacity={0.7} />
      </mesh>
      {device.desktop && (
        <Key
          keyCode="C"
          position-x={-0.125}
          scale={0.085}
          position-z={0.05}
          onPress={() => setOpen(!open)}
        />
      )}
      <Text
        color="white"
        fontSize={0.04}
        anchorX={device.desktop ? "left" : "center"}
        position-x={device.desktop ? -0.045 : 0}
        position-z={0.001}
      >
        {device.desktop ? "to open cart" : "tap to see cart"}
      </Text>
    </a.group>
  );
}
