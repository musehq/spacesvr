import { GroupProps } from "react-three-fiber";
import { useState } from "react";
// @ts-ignore
import { animated, useSpring } from "react-spring/three";
import { Interactable } from "../../../../modifiers";
import { Text } from "@react-three/drei";

type Props = {
  children: string;
  onClick: () => void;
} & GroupProps;

const FONT_SIZE = 0.7;
const ITEM_HEIGHT = FONT_SIZE * 3;

export default function Button(props: Props) {
  const { children, onClick, ...restProps } = props;

  const [hovered, setHovered] = useState(false);

  const { posZ, scale } = useSpring({
    posZ: hovered ? 3.5 : 0.2,
    scale: hovered ? 1 : 0,
    color: hovered ? 0x111111 : 0x000000,
  });

  const width = 4;

  return (
    <group {...restProps} name={`button-${children.replace(" ", "-")}`}>
      <animated.group position-z={posZ}>
        <Interactable
          onClick={onClick}
          onHover={() => setHovered(true)}
          onUnHover={() => setHovered(false)}
        >
          <mesh position-z={-0.01} name="hover-detect">
            <planeBufferGeometry args={[width, ITEM_HEIGHT]} />
            <meshStandardMaterial transparent={true} opacity={0} />
          </mesh>
        </Interactable>
        <animated.group scale-x={scale} position-x={-width / 2}>
          <mesh position-z={-0.01} position-x={width / 2}>
            <planeBufferGeometry args={[width, ITEM_HEIGHT]} />
            <meshStandardMaterial color="#cccccc" />
          </mesh>
        </animated.group>
        {/* @ts-ignore */}
        <Text
          maxWidth={width}
          color="black"
          fontSize={FONT_SIZE * 1.5}
          textAlign="center"
          font="https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf"
        >
          {children.toUpperCase()}
        </Text>
      </animated.group>
    </group>
  );
}
