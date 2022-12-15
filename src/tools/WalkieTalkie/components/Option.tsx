import { GroupProps } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { RoundedBox } from "../../../ideas/primitives/RoundedBox";
import { useSpring, animated } from "@react-spring/three";
import { useState } from "react";
import { HitBox } from "../../../ideas/primitives/HitBox";

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
      <RoundedBox args={[width, FONT_SIZE + PADDING_Y * 2, DEPTH]}>
        {/* @ts-ignore */}
        <animated.meshStandardMaterial color={color} />
      </RoundedBox>
      <HitBox
        args={[width, FONT_SIZE + PADDING_Y * 2, DEPTH]}
        onClick={onClick}
        onHover={() => setHovered(true)}
        onUnHover={() => setHovered(false)}
      />
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
