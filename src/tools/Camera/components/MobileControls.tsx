import { GroupProps, useThree } from "@react-three/fiber";
import { MutableRefObject, useRef } from "react";
import { Mesh, PerspectiveCamera } from "three";
import { cache, useDrag } from "../../../logic";
import { useSpring, animated } from "@react-spring/three";
import { Button, HitBox } from "../../../ideas";
import { Fov } from "../logic/fov";
import { usePlayer } from "../../../layers";
import { Text } from "@react-three/drei";

const FONT_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

type MobileControls = {
  cam: MutableRefObject<PerspectiveCamera | undefined>;
  open: boolean;
  setOpen: (open: boolean) => void;
  fov: Fov;
} & GroupProps;

export default function MobileControls(props: MobileControls) {
  const { cam, open, setOpen, fov, ...rest } = props;

  const { gl } = useThree();
  const { raycaster } = usePlayer();

  const hitbox = useRef<Mesh>(null);
  const touchInside = useRef(false);
  const startVal = useRef<number>();

  const LINE_LENGTH = 0.05;
  const LINE_THICKNESS = 0.008;
  const AREA_HEIGHT = 0.35;

  const { posY } = useSpring({
    posY: fov.normalized * -AREA_HEIGHT + AREA_HEIGHT / 2 - LINE_THICKNESS,
  });

  useDrag(
    {
      onStart: ({ e }) => {
        if (!hitbox.current) return;
        const intersections = raycaster.intersectObject(hitbox.current);
        if (intersections.length === 0) return;
        touchInside.current = true;
        e.stopImmediatePropagation();
      },
      onMove: ({ delta }) => {
        if (!touchInside.current) return;
        if (!startVal.current) startVal.current = cam.current?.fov || 0;
        const newVal = startVal.current + delta.y * 0.5;
        fov.set(newVal);
      },
      onEnd: () => {
        touchInside.current = false;
        startVal.current = undefined;
      },
    },
    gl.domElement,
    [fov]
  );

  return (
    <group {...rest}>
      <group position-y={-0.15}>
        <HitBox ref={hitbox} args={[0.25, AREA_HEIGHT * 1.2, 0.05]} />
        <mesh material={cache.mat_standard_white}>
          <planeGeometry args={[LINE_THICKNESS * 2, AREA_HEIGHT]} />
        </mesh>
        <animated.mesh material={cache.mat_standard_red} position-y={posY}>
          <planeGeometry args={[LINE_LENGTH * 2, LINE_THICKNESS * 4]} />
        </animated.mesh>
      </group>
      <Text
        font={FONT_URL}
        color="white"
        fontSize={0.044}
        anchorY="top"
        anchorX="center"
        position-y={-0.35}
        position-z={0.01}
        lineHeight={1.3}
        renderOrder={10}
        textAlign="center"
      >
        FOV Slider
      </Text>
      {open && (
        <Button
          position-y={0.48}
          position-x={-1}
          scale={1.5}
          rotation-x={0.2}
          color="#ff0000"
          onClick={() => setOpen(false)}
        >
          close
        </Button>
      )}
    </group>
  );
}
