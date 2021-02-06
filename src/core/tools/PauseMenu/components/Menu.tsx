import { GroupProps } from "react-three-fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { Interactable } from "../../../../modifiers/Interactable";
// @ts-ignore
import { animated, useSpring } from "react-spring/three";
import { useState } from "react";
import { MenuItem, useMenuFunctionality } from "../utils/hooks";

const FONT_SIZE = 0.7;
const ITEM_HEIGHT = FONT_SIZE * 3;
const ITEM_PADDING = ITEM_HEIGHT * 0.1;
const SUBTITLE_HEIGHT = FONT_SIZE * 0.9;

const Item = (props: { num: number; item: MenuItem; width: number }) => {
  const { num, item, width } = props;
  const { text, action } = item;

  const [hovered, setHovered] = useState(false);

  const { posZ, scale } = useSpring({
    posZ: hovered ? 3.5 : 0.2,
    scale: hovered ? 1 : 0,
    color: hovered ? 0x111111 : 0x000000,
  });

  return (
    <animated.group
      position-y={(num + 1) * (ITEM_HEIGHT + ITEM_PADDING) + SUBTITLE_HEIGHT}
      position-z={posZ}
    >
      <Interactable
        onClick={action}
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
      <Text
        maxWidth={width}
        color="black"
        fontSize={FONT_SIZE * 1.5}
        textAlign="center"
        font="https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf"
      >
        {text.toUpperCase()}
      </Text>
    </animated.group>
  );
};

const Menu = (props: GroupProps) => {
  const { menuItems } = useMenuFunctionality();

  const WIDTH = FONT_SIZE * 12;
  const HEIGHT =
    (menuItems.length + 1) * (ITEM_HEIGHT + ITEM_PADDING) + SUBTITLE_HEIGHT;

  return (
    <group {...props}>
      <group position-y={-HEIGHT / 2} position-x={WIDTH / 2}>
        <mesh position-y={HEIGHT / 2}>
          <planeBufferGeometry args={[WIDTH, HEIGHT]} />
          <meshStandardMaterial color="white" side={THREE.DoubleSide} />
        </mesh>
        {menuItems.map((item, i) => (
          <Item key={item.text} num={i} item={item} width={WIDTH} />
        ))}
        <Text
          name="subtitle"
          anchorY="bottom"
          position-y={SUBTITLE_HEIGHT / 2}
          position-z={0.01}
          maxWidth={WIDTH}
          color="#333"
          fontSize={FONT_SIZE}
          font="https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf"
        >
          muse
        </Text>
      </group>
    </group>
  );
};

export default Menu;
