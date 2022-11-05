import { GroupProps } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import { animated, config, useSpring } from "@react-spring/three";
import React, { useEffect, useState } from "react";

type Props = {
  keyCode: string;
  keyPress?: string[];
  onPress?: (e: KeyboardEvent) => void;
} & GroupProps;

export default function Key(props: Props) {
  const { keyCode, keyPress = [keyCode], onPress, ...rest } = props;

  const [pressed, setPressed] = useState(false);

  const { color, scale } = useSpring({
    color: pressed ? "#aaa" : "#fff",
    scale: pressed ? 0.5 : 1,
    ...config.stiff,
  });

  useEffect(() => {
    const pressed = (e: KeyboardEvent) =>
      keyPress.map((k) => k.toLowerCase()).includes(e.key.toLowerCase());

    const detectDown = (e: KeyboardEvent) => {
      if (e.key && pressed(e)) setPressed(true);
    };

    const detectUnPress = (e: KeyboardEvent) => {
      if (e.key && pressed(e)) setPressed(false);
    };

    const detectPress = (e: KeyboardEvent) => {
      if (e.key && pressed(e)) onPress?.(e);
    };

    document.addEventListener("keydown", detectDown);
    document.addEventListener("keyup", detectUnPress);
    document.addEventListener("keypress", detectPress);

    return () => {
      document.removeEventListener("keydown", detectDown);
      document.removeEventListener("keyup", detectUnPress);
      document.removeEventListener("keypress", detectPress);
    };
  }, [keyPress, onPress]);

  return (
    <group name="spacesvr-key" {...rest}>
      <group position-z={-0.5}>
        <animated.group scale-z={scale}>
          <group position-z={0.25}>
            <RoundedBox
              args={[1, 1, 0.5]}
              radius={0.125}
              position-z={-0.25 - 0.01}
              smoothness={10}
            >
              {/* @ts-ignore */}
              <animated.meshStandardMaterial color={color} />
            </RoundedBox>
            <Text color="black" fontSize={0.5}>
              {keyCode}
            </Text>
          </group>
        </animated.group>
      </group>
    </group>
  );
}
