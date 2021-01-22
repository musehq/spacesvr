import { GroupProps } from "react-three-fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { Interactable } from "../../../../modifiers/Interactable";
// @ts-ignore
import { animated, useSpring } from "react-spring/three";
import { useState } from "react";

const FONT_SIZE = 1;
const ITEM_HEIGHT = FONT_SIZE * 2.5;

type MenuItem = {
  text: string;
  action: () => void;
};

const Item = (props: { num: number; item: MenuItem; width: number }) => {
  const { num, item, width } = props;
  const { text, action } = item;

  const [hovered, setHovered] = useState(false);

  const { posZ, scale } = useSpring({
    posZ: hovered ? 3.5 : 0.2,
    scale: hovered ? 3 : 1,
  });

  return (
    <animated.group position-y={(num + 1) * ITEM_HEIGHT} position-z={posZ}>
      <Interactable
        onClick={action}
        onHover={() => setHovered(true)}
        onUnHover={() => setHovered(false)}
      >
        <Text
          maxWidth={width}
          color={"black"}
          fontSize={1.5}
          font="https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf"
        >
          {text.toUpperCase()}
        </Text>
      </Interactable>
    </animated.group>
  );
};

const Menu = (props: GroupProps) => {
  const menuItems: MenuItem[] = [
    { text: "Enter VR", action: () => console.log("try to enter vr") },
    { text: "Mute Audio", action: () => console.log("mute audio") },
    { text: "Fullscreen", action: () => console.log("mute audio") },
    { text: "Tutorial", action: () => console.log("mute audio") },
  ];

  const WIDTH = 12;
  const HEIGHT = (menuItems.length + 1) * ITEM_HEIGHT;

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
      </group>
    </group>
  );
};

export default Menu;