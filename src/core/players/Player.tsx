import { useRef, useMemo, ReactNode, useLayoutEffect } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Camera, Raycaster, Vector3 } from "three";
import { useEnvironment } from "../contexts/environment";
import { createPlayerState } from "../utils/player";
import KeyboardMovement from "../controls/KeyboardMovement";
import TouchFPSCamera from "../controls/TouchFPSCamera";
import {
  useCapsuleCollider,
  VisibleCapsuleCollider,
} from "./colliders/CapsuleCollider";
import { GyroControls } from "../controls/GyroControls";
import VRControllerMovement from "../controls/VRControllerMovement";
import { DefaultXRControllers } from "@react-three/xr";
import ClickDragControls from "../controls/ClickDragControls";
import NippleMovement from "../controls/NippleMovement";
import { PlayerContext } from "../contexts/player";
import { useSpringVelocity } from "./utils/velocity";

const SPEED = 2.8; // (m/s) 1.4 walking, 2.2 jogging, 6.6 running
const SHOW_PLAYER_HITBOX = false;

export type PlayerProps = {
  pos?: Vector3;
  rot?: number;
  speed?: number;
  controls?: {
    disableGyro?: boolean;
  };
};

/**
 * Player represents a physics-enabled player in the environment, complete with a
 * control scheme and a physical representation that interacts with other physics-
 * enabled objects.
 *
 * There should only be one player per environment.
 *
 * @constructor
 */
const Player = (props: { children: ReactNode[] | ReactNode } & PlayerProps) => {
  const {
    children,
    pos = new Vector3(),
    rot = 0,
    speed = SPEED,
    controls,
  } = props;

  const { camera, raycaster: defaultRaycaster, gl } = useThree();
  const { device, pointerLocked } = useEnvironment();
  const [bodyRef, bodyApi] = useCapsuleCollider({ initPos: pos });
  const { direction, updateVelocity } = useSpringVelocity(bodyApi, speed);

  // local state
  const position = useRef(new Vector3());
  const velocity = useRef(new Vector3());
  const lockControls = useRef(false);
  const raycaster = useMemo(
    () => new Raycaster(new Vector3(), new Vector3(), 0, 1.5),
    []
  );

  useLayoutEffect(() => {
    // store position and velocity
    bodyApi.position.subscribe((p) => position.current.fromArray(p));
    bodyApi.velocity.subscribe((v) => velocity.current.fromArray(v));

    // initial look and position
    const xLook = pos.x + 100 * Math.cos(rot);
    const zLook = pos.z + 100 * Math.sin(rot);
    camera.lookAt(xLook, pos.y, zLook);
    camera.position.copy(pos);
  }, []);

  useFrame(() => {
    const cam: Camera = device.xr ? gl.xr.getCamera(camera) : camera;

    // update raycaster
    raycaster.ray.origin.copy(position.current);
    const lookAt = new Vector3(0, 0, -1);
    lookAt.applyQuaternion(cam.quaternion);
    raycaster.ray.direction.copy(lookAt);

    // update camera position
    camera.position.copy(position.current);

    // update velocity
    if (!lockControls.current) {
      updateVelocity(camera, velocity.current);
    }
  });

  useFrame(({ gl, scene, camera }) => gl.render(scene, camera), 100);

  const state = createPlayerState(
    bodyApi,
    position,
    velocity,
    lockControls,
    device.mobile || !pointerLocked ? defaultRaycaster : raycaster
  );

  return (
    <PlayerContext.Provider value={state}>
      {device.mobile && (
        <>
          {controls?.disableGyro ? (
            <TouchFPSCamera />
          ) : (
            <GyroControls fallback={<TouchFPSCamera />} />
          )}
          <NippleMovement direction={direction} />
        </>
      )}
      {device.desktop && (
        <>
          <KeyboardMovement direction={direction} />
          <ClickDragControls />
        </>
      )}
      {device.xr && (
        <>
          <VRControllerMovement position={position} direction={direction} />
          <DefaultXRControllers />
        </>
      )}
      <mesh ref={bodyRef} name="player">
        {SHOW_PLAYER_HITBOX && <VisibleCapsuleCollider />}
      </mesh>
      {children}
    </PlayerContext.Provider>
  );
};

export default Player;
