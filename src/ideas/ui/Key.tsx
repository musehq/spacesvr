import { GroupProps } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { animated, config, useSpring } from "@react-spring/three";
import { useEffect, useState } from "react";
import { RoundedBox } from "../primitives/RoundedBox";

type Props = {
  keyCode: string;
  keyPress?: string[];
  onPress?: (e: KeyboardEvent) => void;
} & GroupProps;

export function Key(props: Props) {
  const { keyCode, keyPress = [keyCode], onPress, ...rest } = props;

  const [pressed, setPressed] = useState(false);

  const { color, scale } = useSpring({
    color: pressed ? "#aaa" : "#fff",
    scale: pressed ? 0.5 : 1,
    ...config.stiff,
  });

  const DEPTH = 0.25;

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
      <group position-z={-DEPTH}>
        <animated.group scale-z={scale}>
          <group position-z={DEPTH / 2}>
            <RoundedBox args={[1, 1, DEPTH]} position-z={-DEPTH / 2 - 0.01}>
              {/* @ts-ignore */}
              <animated.meshStandardMaterial color={color} />
            </RoundedBox>
            <Text color="black" fontSize={0.5} renderOrder={2}>
              {keyCode}
            </Text>
          </group>
        </animated.group>
      </group>
    </group>
  );
}
