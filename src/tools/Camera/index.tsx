import { useCallback, useEffect, useRef, useState } from "react";
import { Group, Mesh, PerspectiveCamera as ThrPerspectiveCamera } from "three";
import { createPortal, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { usePhotography } from "./logic/photo";
import { useEnvironment } from "../../layers/Environment";
import { config, useSpring, animated } from "@react-spring/three";
import { Tool } from "../../ideas/modifiers/Tool";
import { useToolbelt } from "../../layers/Toolbelt";
import { HitBox, Model } from "../../ideas";
import { isTyping, useHudDims, useKeypress } from "../../logic";
import { useRendering } from "./logic/rendering";
import Instruction from "./components/Instruction";
import DesktopControls from "./components/DesktopControls";
import ShutterButton from "./components/ShutterButton";
import { useFov } from "./logic/fov";
import MobileControls from "./components/MobileControls";
import PhotoPreview from "./components/PhotoPreview";

const AUDIO_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/tools/camera/shutter-sound.mp3";
const CAMERA_MODEL_URL =
  "https://d1htv66kutdwsl.cloudfront.net/0308efc4-0b68-4b2e-b688-92512323178b/aa44f4af-f7c2-4050-9e6c-536ee07bbb1a.glb";
const CAMERA_ICON_URL =
  "https://d1htv66kutdwsl.cloudfront.net/44e643ef-7fe6-45da-9f99-54a5988ff338/8eb59c54-4aba-479a-b7cd-54a300b36c20.png";

const TIMEOUT = 2; //s

type CameraProps = { onCapture?: () => void };

export function Camera(props: CameraProps) {
  const { onCapture } = props;

  const { device, paused } = useEnvironment();
  const { scene, clock } = useThree();
  const toolbelt = useToolbelt();

  const cam = useRef<ThrPerspectiveCamera>();
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);

  const [open, setOpen] = useState(false);
  const [shutterPressed, setShutterPressed] = useState(false);
  const fov = useFov(cam);

  const lastShotTime = useRef(0);
  const ENABLED = toolbelt.activeTool?.name === "Camera";
  const photo = usePhotography(cam);
  const dims = useHudDims();
  const SCALE = Math.min(dims.width * 0.25, device.mobile ? 0.2 : 0.325);

  const { rotX, rotY, scale } = useSpring({
    rotX: open ? 0 : 0.3,
    rotY: open ? 0 : device.mobile ? Math.PI - 0.5 : -0.1,
    scale: open ? SCALE : device.mobile ? 0.1 : 0.25,
    config: config.stiff,
  });

  useRendering(ENABLED && open, cam, group, mesh, photo);

  const onClick = useCallback(() => {
    if (shutterPressed) return;
    if (lastShotTime.current + TIMEOUT > clock.getElapsedTime()) return;
    lastShotTime.current = clock.getElapsedTime();
    setShutterPressed(true);
    const audio = new Audio(AUDIO_URL);
    audio.play();
    setTimeout(() => {
      // let the shutter sound and anim play
      photo.takePicture();
      if (onCapture) onCapture();
    }, 300);
  }, [clock, onCapture, photo, shutterPressed]);

  useEffect(() => {
    if (!ENABLED || paused || device.mobile || !open) return;
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [ENABLED, device.mobile, onClick, open, paused]);

  useKeypress(
    ["c", "C"],
    () => {
      if (isTyping() || !ENABLED) return;
      setOpen(!open);
    },
    [ENABLED, open]
  );

  const POS: [number, number] = open
    ? [0, 0]
    : device.mobile
    ? [0.9, 0.9]
    : [0.8, -0.8];

  return (
    <group name="camera-tool-resources" ref={group}>
      <Tool
        name="Camera"
        pos={POS}
        pinY
        icon={CAMERA_ICON_URL}
        face={false}
        disableDraggable={open}
        onSwitch={(e) => !e && setOpen(false)}
      >
        <Instruction open={open} setOpen={setOpen} />
        <animated.group scale={scale} rotation-x={rotX} rotation-y={rotY}>
          <Model
            src={CAMERA_MODEL_URL}
            center
            normalize
            rotation-y={Math.PI}
            scale={3}
          />
          {device.mobile && !open && (
            <HitBox
              args={[3, 1.8, 1.6]}
              position-z={0.3}
              onClick={() => setOpen(true)}
            />
          )}
          <group name="top-row" position={[1, 0.7, 0.75]}>
            <ShutterButton
              open={open}
              pressed={shutterPressed}
              setPressed={setShutterPressed}
              onPress={onClick}
            />
          </group>
          <group name="content" position={[0, -0.18, 1.101]} scale={2}>
            <mesh
              ref={mesh}
              name="viewfinder"
              position={[-0.15, 0.03, 0]}
              scale-x={1.1}
              scale-y={1.1}
            >
              <planeGeometry args={[photo.aspect.x, photo.aspect.y]} />
              <meshStandardMaterial
                map={photo.target.texture}
                metalness={0.68}
                roughness={0.7}
              />
            </mesh>
            {device.desktop ? (
              <DesktopControls
                cam={cam}
                open={open}
                fov={fov}
                position={[0.485, 0.12, 0.005]}
              />
            ) : (
              <MobileControls
                cam={cam}
                open={open}
                setOpen={setOpen}
                fov={fov}
                position={[0.5, 0.12, 0.004]}
              />
            )}
          </group>
        </animated.group>
      </Tool>
      {createPortal(
        <PerspectiveCamera ref={cam} near={0.01} far={300} />,
        scene
      )}
      <PhotoPreview photo={photo} />
    </group>
  );
}
