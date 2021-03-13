import { Text } from "@react-three/drei";
import * as THREE from "three";
import { GroupProps } from "react-three-fiber";
import { useEffect, useState } from "react";
import { useNavigator } from "../utils/context";

const FONT_SIZE = 0.7;
const PADDING = 1; // top padding
const WIDTH = FONT_SIZE * 16;
const HEIGHT = 7;

const steps = [
  "Happy to show you around! Let's start by looking around\n\nMove your mouse to tilt your head, or click and drag to turn your body",
  "Now let's try walking!\n\nPress WASD or the arrow keys to explore the reality around you",
  "You're a natural! Careful not to trip though, if you hurt yourself in virtual reality you hurt yourself in real life\n\nJust Kidding\n",
  "Finally, know that I'm easy to find, just like your whore mother\n\nPress 't' to send me on my merry way. No hard feelings",
];

export default function Tutorial(props: GroupProps) {
  const { setStage } = useNavigator();
  const [step, setStep] = useState(0);

  const onKeyPress = (e: any) => {
    const key = e.key.toLowerCase();
    if (
      step === 1 &&
      (key === "w" ||
        key === "a" ||
        key === "s" ||
        key === "d" ||
        key === "arrowup" ||
        key === "arrowleft" ||
        key === "arrowright" ||
        key === "arrowdown")
    ) {
      setTimeout(() => setStep(2), 5000);
    } else if (step === 3 && e.key.toLowerCase() === "t") {
      setTimeout(() => setStage("menu"), 1000);
    }
  };

  // eventually look for mouse movement rather than just click
  const onMouseDown = () => {
    if (step === 0) {
      setTimeout(() => setStep(1), 3000);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyPress);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyPress);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [step]);

  useEffect(() => {
    if (step === 2) {
      setTimeout(() => setStep(3), 5000);
    }
    // if (step === 3) {
    //   setTimeout(() => setStep(4), 5000);
    // }
  }, [step]);

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
          lineHeight={1.2}
          font="https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf"
        >
          {steps[step]}
        </Text>
      </group>
    </group>
  );
}
