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
 * Player represents a user controlled entity, complete with a
 * control scheme and a physical representation that interacts with other physics-
 * enabled objects.
 *
 *
 *
 * @constructor
 */
export function Player(props: PlayerLayer) {
  const { children, pos = [0, 1, 0], rot = 0, speed = SPEED, controls } = props;

  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const defaultRaycaster = useThree((state) => state.raycaster);

  const { device } = useEnvironment();

  // physical body
  const [, bodyApi] = useCapsuleCollider(pos);
  const { direction, updateVelocity } = useSpringVelocity(bodyApi, speed);

  // local state
  const position = useRef(new Vector3());
  const velocity = useRef(new Vector3());
  const lockControls = useRef(false);
  const raycaster = useMemo(
    () => new Raycaster(new Vector3(), new Vector3(), 0, 2),
    []
  );

  // initial rotation
  useEffect(() => {
    // rotation happens before position move
    camera.rotation.setFromQuaternion(
      new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), rot)
    );
  }, []);

  // due to use-cannon bugs, we have to manually check for the active subscription
  const activeSubId = useRef<number>();
  useEffect(() => {
    const subId = Math.random();
    activeSubId.current = subId;
    bodyApi.position.subscribe((p) => {
      if (activeSubId.current !== subId) return;
      position.current.fromArray(p);
    });
    bodyApi.velocity.subscribe((v) => {
      if (activeSubId.current !== subId) return;
      velocity.current.fromArray(v);
    });
  }, [bodyApi, bodyApi.position, bodyApi.velocity]);

  useFrame(() => {
    const cam: Camera = device.xr ? gl.xr.getCamera(camera) : camera;

    // update raycaster on desktop (mobile uses default)
    if (device.desktop) {
      raycaster.ray.origin.copy(position.current);
      raycaster.ray.direction.set(0, 0, -1);
      raycaster.ray.direction.applyQuaternion(cam.quaternion);
    }

    camera.position.copy(position.current);

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
      {SHOW_PLAYER_HITBOX && <VisibleCapsuleCollider />}
      {children}
    </PlayerContext.Provider>
  );
}
