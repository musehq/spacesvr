import { GroupProps } from "@react-three/fiber";
import { MutableRefObject, useEffect } from "react";
import { PerspectiveCamera } from "three";
import { cache } from "../../../logic";
import { useSpring, animated } from "@react-spring/three";
import { Text } from "@react-three/drei";
import { Key } from "../../../ideas";
import { Fov } from "../logic/fov";

const FONT_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

type DesktopControls = {
  cam: MutableRefObject<PerspectiveCamera | undefined>;
  open: boolean;
  fov: Fov;
} & GroupProps;

export default function DesktopControls(props: DesktopControls) {
  const { cam, open, fov, ...rest } = props;

  const LINE_LENGTH = 0.05;
  const LINE_THICKNESS = 0.008;
  const AREA_WIDTH = 0.24;
  const INDICATOR_WIDTH = 0.18;

  const { posX } = useSpring({
    posX: fov.normalized * -INDICATOR_WIDTH + INDICATOR_WIDTH / 2,
  });

  useEffect(() => {
    // increase/decrease fov on scroll
    const onScroll = (e: WheelEvent) => {
      if (!cam.current) return;
      const newVal = cam.current.fov + e.deltaY * 0.05;
      fov.set(newVal);
    };
    window.addEventListener("wheel", onScroll);
    return () => window.removeEventListener("wheel", onScroll);
  }, [cam, fov]);

  return (
    <group {...rest}>
      <mesh material={cache.mat_standard_white}>
        <planeGeometry args={[INDICATOR_WIDTH, LINE_THICKNESS]} />
      </mesh>
      <animated.mesh
        material={cache.mat_standard_red}
        position-x={posX}
        position-y={LINE_LENGTH / 2 - LINE_THICKNESS / 2}
      >
        <planeGeometry args={[LINE_THICKNESS, LINE_LENGTH]} />
      </animated.mesh>
      <Text
        font={FONT_URL}
        color="white"
        fontSize={0.032}
        anchorY="top"
        anchorX="right"
        position-y={-0.02}
        position-x={AREA_WIDTH / 2}
        position-z={0.01}
        lineHeight={1.3}
        renderOrder={10}
        textAlign="center"
        maxWidth={AREA_WIDTH}
      >
        {"Scroll to zoom\n\n\nClick to shoot\n\n\nPress        to close"}
      </Text>
      <Key keyCode={"C"} scale={0.05} position={[0.025, -0.29, 0.03]} />
    </group>
  );
}
