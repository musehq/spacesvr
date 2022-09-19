import { useEffect, useMemo, useRef, Suspense, useState } from "react";
import {
  Group,
  Quaternion,
  Vector3,
  Mesh,
  PerspectiveCamera as ThrPerspectiveCamera,
} from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Text } from "@react-three/drei";
import CameraModel, { CAMERA_FILE_URL } from "./models/Camera";
import { useModelState } from "./utils/load";
import { usePhotography } from "./utils/photo";
import { useEnvironment } from "../../layers/Environment";
import { config, useSpring, animated } from "@react-spring/three";
import { Tool } from "../../ideas/modifiers/Tool";
import { useToolbelt } from "../../layers/Toolbelt";

const AUDIO_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/tools/camera/shutter-sound.mp3";

export function Camera() {
  const { device, paused } = useEnvironment();
  const { scene } = useThree();
  const toolbelt = useToolbelt();

  const cam = useRef<ThrPerspectiveCamera>();
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const modelState = useModelState(CAMERA_FILE_URL);
  const photo = usePhotography(cam);
  const [pressShutter, setPressShutter] = useState(false);

  const ENABLED = toolbelt.activeTool?.name === "Camera";

  const { shutterY } = useSpring({
    shutterY: pressShutter ? 0 : 1,
    config: config.stiff,
  });

  const dummy = useMemo(() => new Vector3(), []);
  const qummy = useMemo(() => new Quaternion(), []);
  useFrame((state) => {
    if (!cam.current || !mesh.current || !group.current || !ENABLED) return;

    // move mesh to camera's position
    mesh.current.getWorldPosition(dummy);
    cam.current.position.set(0, 0, 0);
    cam.current.position.add(dummy);
    mesh.current.getWorldQuaternion(qummy);
    cam.current.rotation.setFromQuaternion(qummy);

    // render to camera viewfinder
    state.gl.setRenderTarget(photo.target);
    state.gl.render(scene, cam.current);
    state.gl.setRenderTarget(null);
  });

  useEffect(() => {
    if (!ENABLED || paused || pressShutter) return;
    const onClick = () => {
      setPressShutter(true);
      const audio = new Audio(AUDIO_URL);
      audio.play();
      photo.takePicture();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [ENABLED, paused, photo, pressShutter]);

  useEffect(() => {
    if (pressShutter) setTimeout(() => setPressShutter(false), 750);
  }, [pressShutter]);

  if (!device.desktop) {
    return null;
  }

  return (
    <group name="camera" ref={group}>
      <Tool name="Camera" keymap="p" pos={[0, 0]} distance={5} pinY t={0.1}>
        <group scale={2.5}>
          {modelState === "loaded" ? (
            <Suspense fallback={null}>
              <CameraModel rotation-y={Math.PI} />
            </Suspense>
          ) : (
            <mesh position-z={-0.5}>
              <boxBufferGeometry args={[4, 2, 1]} />
              <meshLambertMaterial color="gray" />
            </mesh>
          )}
          <group name="content" position={[0, -0.18, 0.15]} scale={2}>
            <animated.group scale-y={shutterY}>
              <mesh ref={mesh} name="viewfinder" position-y={0.05}>
                <planeBufferGeometry args={[photo.aspect.x, photo.aspect.y]} />
                <meshBasicMaterial map={photo.target.texture} />
              </mesh>
            </animated.group>
            <Text
              color="white"
              fontSize={0.075}
              anchorY="top"
              position-y={-0.225}
              outlineColor="black"
              outlineWidth={0.01}
            >
              click to take a picture
            </Text>
          </group>
        </group>
      </Tool>
      <PerspectiveCamera
        ref={cam}
        position-z={0.9 * 4.4}
        near={0.1}
        far={150}
      />
    </group>
  );
}
