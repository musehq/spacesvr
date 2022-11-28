import { useCallback, useEffect, useRef, useState } from "react";
import { Group, Mesh, PerspectiveCamera as ThrPerspectiveCamera } from "three";
import { createPortal, MeshProps, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Text } from "@react-three/drei";
import { usePhotography } from "./logic/photo";
import { useEnvironment } from "../../layers/Environment";
import { config, useSpring, animated } from "@react-spring/three";
import { Tool } from "../../ideas/modifiers/Tool";
import { useToolbelt } from "../../layers/Toolbelt";
import { Button, Interactable, Model } from "../../ideas";
import { isTyping, useKeypress } from "../../logic";
import { useRendering } from "./logic/rendering";
import Instruction from "./components/Instruction";

const AUDIO_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/tools/camera/shutter-sound.mp3";
const CAMERA_MODEL_URL =
  "https://d1htv66kutdwsl.cloudfront.net/6a38d41a-9fd4-43aa-bd7a-e2c6e16f6f20/ec577637-0ab6-4101-b077-d84f6a69e062.glb";
const FONT_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

type CameraProps = { onCapture?: () => void };

export function Camera(props: CameraProps) {
  const { onCapture } = props;

  const { device, paused } = useEnvironment();
  const { scene } = useThree();
  const toolbelt = useToolbelt();

  const cam = useRef<ThrPerspectiveCamera>();
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);

  const [open, setOpen] = useState(false);
  const [pressShutter, setPressShutter] = useState(false);
  const ENABLED = toolbelt.activeTool?.name === "Camera";
  const photo = usePhotography(cam, open);

  const { shutterY, rotX, rotY, scale } = useSpring({
    shutterY: pressShutter || !open ? 0 : 1,
    rotX: open ? 0 : 0.3,
    rotY: open ? 0 : device.mobile ? Math.PI - 0.5 : -0.1,
    scale: open ? (device.mobile ? 0.15 : 0.2) : device.mobile ? 0.1 : 0.25,
    config: config.stiff,
  });

  useRendering(ENABLED, cam, group, mesh, photo.target);

  const onClick = useCallback(() => {
    setPressShutter(true);
    const audio = new Audio(AUDIO_URL);
    audio.play();
    photo.takePicture();
    if (onCapture) onCapture();
  }, [onCapture, photo]);

  useEffect(() => {
    if (!ENABLED || paused || pressShutter || !open) return;
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [ENABLED, paused, photo, pressShutter, device, open, onCapture]);

  useEffect(() => {
    if (pressShutter) setTimeout(() => setPressShutter(false), 750);
  }, [pressShutter]);

  useKeypress(
    "c",
    () => {
      if (isTyping() || !ENABLED) return;
      setOpen(!open);
    },
    [ENABLED, open]
  );

  const BoxApproximation = (props: MeshProps) => (
    <mesh position-z={0.5} {...props}>
      <boxBufferGeometry args={[4, 2.25, 1.15]} />
    </mesh>
  );

  const POS: [number, number] = open
    ? [0, 0]
    : device.mobile
    ? [0.9, 0.9]
    : [0.8, -0.8];

  const INFO_TEXT = device.mobile
    ? "tap camera to take a picture"
    : "click to take a picture\nscroll to zoom\nc to close";

  return (
    <group name="camera-tool-resources" ref={group}>
      <Tool name="Camera" pos={POS} pinY face={false}>
        <Instruction open={open} setOpen={setOpen} />
        <animated.group scale={scale} rotation-x={rotX} rotation-y={rotY}>
          <Model src={CAMERA_MODEL_URL} center rotation-y={Math.PI} />
          {device.mobile && (
            <Interactable onClick={!open ? () => setOpen(true) : onClick}>
              <BoxApproximation visible={false} />
            </Interactable>
          )}
          <group name="content" position={[0, -0.18, 1.001]} scale={2}>
            <animated.group scale-y={shutterY}>
              <mesh ref={mesh} name="viewfinder" position-y={-0.025} scale={1}>
                <planeBufferGeometry args={[photo.aspect.x, photo.aspect.y]} />
                <meshBasicMaterial map={photo.target.texture} />
              </mesh>
            </animated.group>
            <Text
              font={FONT_URL}
              color="white"
              fontSize={0.075}
              anchorY="top"
              position-y={-0.525}
              lineHeight={1.05}
              rotation-x={-0.4}
              outlineColor="black"
              outlineWidth={0.075 * 0.1}
              renderOrder={10}
              visible={open}
              textAlign="center"
            >
              {INFO_TEXT}
            </Text>
            {device.mobile && open && (
              <Button
                position-y={-0.75}
                scale={1.75}
                rotation-x={-0.4}
                onClick={() => setOpen(false)}
              >
                close
              </Button>
            )}
          </group>
        </animated.group>
      </Tool>
      {createPortal(
        <PerspectiveCamera ref={cam} near={0.1} far={200} fov={photo.fov} />,
        scene
      )}
    </group>
  );
}
