import { GroupProps } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import { Interactable } from "../../../ideas/modifiers/Interactable";
import { useSpring, animated } from "@react-spring/three";
import { useState } from "react";

type OptionProps = {
  onClick: () => void;
  width: number;
  children: string;
  index: number;
} & GroupProps;

export function Option(props: OptionProps) {
  const { onClick, width, children, index, ...rest } = props;

  const [hovered, setHovered] = useState(false);

  const { color } = useSpring({ color: hovered ? "#b3b3b3" : "#ffffff" });

  const PADDING_X = 0.015;
  const PADDING_Y = 0.0125;
  const FONT_SIZE = 0.02;
  const DEPTH = 0.01;
  const CLIP_WIDTH =
    index === 0 ? width - PADDING_X * 4 : width - PADDING_X * 2;

  return (
    <group name="option" {...rest}>
      <Interactable
        onClick={onClick}
        onHover={() => setHovered(true)}
        onUnHover={() => setHovered(false)}
      >
        <RoundedBox
          args={[width, FONT_SIZE + PADDING_Y * 2, DEPTH]}
          radius={Math.min(width, FONT_SIZE, DEPTH) * 0.5}
        >
          {/* @ts-ignore */}
          <animated.meshStandardMaterial color={color} />
        </RoundedBox>
      </Interactable>
      <group position-z={DEPTH / 2 + 0.001}>
        <Text
          fontSize={FONT_SIZE}
          color="black"
          anchorX="left"
          position-x={-width / 2 + PADDING_X}
          maxWidth={width}
          // @ts-ignore
          whiteSpace="nowrap"
          clipRect={[0, -Infinity, CLIP_WIDTH, Infinity]}
        >
          {children}
        </Text>
      </group>
    </group>
  );
}
