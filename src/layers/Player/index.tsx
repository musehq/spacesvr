import {
  useRef,
  useEffect,
  ReactNode,
  useMemo,
  createContext,
  useContext,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Camera, Quaternion, Raycaster, Vector3 } from "three";
import NippleMovement from "./controls/NippleMovement";
import KeyboardMovement from "./controls/KeyboardMovement";
import PointerLockControls from "./controls/PointerLockControls";
import TouchFPSCamera from "./controls/TouchFPSCamera";
import {
  useCapsuleCollider,
  VisibleCapsuleCollider,
} from "./colliders/CapsuleCollider";
import { GyroControls } from "./controls/GyroControls";
import { useSpringVelocity } from "./utils/velocity";
import { createPlayerState } from "./utils/player";
import { useEnvironment } from "../Environment";
import VRControllerMovement from "./controls/VRControllerMovement";
import { PlayerState } from "./types/player";

export const PlayerContext = createContext({} as PlayerState);
export const usePlayer = () => useContext(PlayerContext);

const SPEED = 3.6; // (m/s) 1.4 walking, 2.6 jogging, 4.1 running
const SHOW_PLAYER_HITBOX = false;

export type PlayerProps = {
  pos?: number[];
  rot?: number;
  speed?: number;
  controls?: {
    disableGyro?: boolean;
  };
};

type PlayerLayer = { children: ReactNode[] | ReactNode } & PlayerProps;

/**
 * Player represents a physics-enabled player in the environment, complete with a
 * control scheme and a physical representation that interacts with other physics-
 * enabled objects.
 *
 * There should only be one player per environment.
 *
 * @constructor
 */
export function Player(props: PlayerLayer) {
  const { children, pos = [0, 1, 0], rot = 0, speed = SPEED, controls } = props;

  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const defaultRaycaster = useThree((state) => state.raycaster);

  const st = useEnvironment();
  const { device } = st;

  // physical body
  const [bodyRef, bodyApi] = useCapsuleCollider(pos);
  const { direction, updateVelocity } = useSpringVelocity(bodyApi, speed);

  // local state
  const position = useRef(new Vector3());
  const velocity = useRef(new Vector3());
  const lockControls = useRef(false);
  const raycaster = useMemo(
    () => new Raycaster(new Vector3(), new Vector3(), 0, 1.5),
    []
  );

  // setup player
  useEffect(() => {
    // store position and velocity
    bodyApi.position.subscribe((p) => position.current.fromArray(p));
    bodyApi.velocity.subscribe((v) => velocity.current.fromArray(v));

    // rotation happens before position move
    camera.rotation.setFromQuaternion(
      new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), rot)
    );
  }, []);

  useFrame(() => {
    const cam: Camera = device.xr ? gl.xr.getCamera(camera) : camera;

    // update raycaster
    if (device.desktop) {
      raycaster.ray.origin.copy(position.current);
      const lookAt = new Vector3(0, 0, -1);
      lookAt.applyQuaternion(cam.quaternion);
      raycaster.ray.direction.copy(lookAt);
    }

    // update camera position
    camera.position.copy(position.current);

    // update velocity
    if (!lockControls.current) {
      updateVelocity(cam, velocity.current);
    }
  });

  const state = createPlayerState(
    bodyApi,
    position,
    velocity,
    lockControls,
    device.mobile ? defaultRaycaster : raycaster
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
          <PointerLockControls />
        </>
      )}
      {device.xr && (
        <VRControllerMovement position={position} direction={direction} />
      )}
      <group name="player" ref={bodyRef}>
        {SHOW_PLAYER_HITBOX && <VisibleCapsuleCollider />}
      </group>
      {children}
    </PlayerContext.Provider>
  );
}
