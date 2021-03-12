import { Text } from "@react-three/drei";
import * as THREE from "three";
import { GroupProps } from "react-three-fiber";
import { MenuState } from "../index";
import { useEffect } from "react";
import { setOnboarded } from "../utils/onboard";

const FONT_SIZE = 0.7;
const PADDING = 1; // top padding
const WIDTH = FONT_SIZE * 16;
const HEIGHT = 6;

type Props = {
  setState: (s: MenuState) => void;
} & GroupProps;

const Welcome = (props: Props) => {
  const { setState, ...restProps } = props;

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "n") {
      setState("menu");
      setOnboarded();
    } else if (e.key.toLowerCase() === "y") {
      setState("tutorial");
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", onKeyPress);
    return () => {
      window.removeEventListener("keypress", onKeyPress);
    };
  }, [open]);

  return (
    <group {...restProps} position-y={-HEIGHT / 8}>
      <group position-x={WIDTH / 2}>
        <mesh>
          <planeBufferGeometry args={[WIDTH, HEIGHT]} />
          <meshStandardMaterial color="white" side={THREE.DoubleSide} />
        </mesh>
        <Text
          position-y={HEIGHT / 2 - PADDING}
          position-z={0.01}
          maxWidth={WIDTH - PADDING}
          color="#333"
          fontSize={FONT_SIZE}
          textAlign="left"
          anchorY="top"
          font="https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf"
        >
          {
            "Welcome to the metaverse.\n\nNeed some help navigating this reality?\n\n        [Y] Yes        [N] No"
          }
        </Text>
      </group>
    </group>
  );
};

export default Welcome;
