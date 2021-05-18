import { Text } from "@react-three/drei";
import * as THREE from "three";
import { GroupProps } from "react-three-fiber";
import { useEffect } from "react";
import { setOnboarded } from "../utils/onboard";
import { useNavigator } from "../utils/context";
import Button from "../components/Button";

const FONT_SIZE = 0.7;
const PADDING = 1; // top padding
const WIDTH = FONT_SIZE * 16;
const HEIGHT = 7;

export default function Welcome(props: GroupProps) {
  const { setStage } = useNavigator();

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "n") {
      setStage("menu");
      setOnboarded();
    } else if (e.key.toLowerCase() === "y") {
      setStage("tutorial");
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", onKeyPress);
    return () => {
      window.removeEventListener("keypress", onKeyPress);
    };
  }, [open]);

  return (
    <group {...props} position-y={-HEIGHT / 8}>
      <group position-x={WIDTH / 2}>
        <mesh>
          <planeBufferGeometry args={[WIDTH, HEIGHT]} />
          <meshStandardMaterial color="white" side={THREE.DoubleSide} />
        </mesh>
        {/* @ts-ignore */}
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
            "Welcome to the metaverse. \n\nNeed some help navigating this reality?"
          }
        </Text>
        <Button
          onClick={() => setStage("tutorial")}
          position={[-3, -1.75, 0.25]}
        >
          Yes
        </Button>
        <Button onClick={() => setStage("menu")} position={[2.5, -1.75, 0.25]}>
          No
        </Button>
      </group>
    </group>
  );
}
