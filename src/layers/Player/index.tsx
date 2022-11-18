import {
  useRef,
  useEffect,
  ReactNode,
  useMemo,
  createContext,
  useContext,
  useCallback,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Camera, Quaternion, Raycaster, Vector3 } from "three";
import NippleMovement from "./components/controls/NippleMovement";
import KeyboardMovement from "./components/controls/KeyboardMovement";
import PointerLockControls from "./components/controls/PointerLockControls";
import TouchFPSCamera from "./components/controls/TouchFPSCamera";
import {
  useCapsuleCollider,
  VisibleCapsuleCollider,
} from "./components/colliders/CapsuleCollider";
import { GyroControls } from "./components/controls/GyroControls";
import { useSpringVelocity } from "./logic/velocity";
import { useEnvironment } from "../Environment";
import VRControllerMovement from "./components/controls/VRControllerMovement";
import { useControlLock } from "./logic/controls";
import { useBob } from "./logic/bob";

type PlayerVec = {
  set: (vec: Vector3) => void;
  get: () => Vector3;
};

type PlayerControls = {
  lock: () => void;
  unlock: () => void;
  isLocked: () => boolean;
};

type PlayerState = {
  position: PlayerVec;
  velocity: PlayerVec;
  controls: PlayerControls;
  raycaster: Raycaster;
};

export const PlayerContext = createContext({} as PlayerState);
export const usePlayer = () => useContext(PlayerContext);

const SPEED = 3.6; // (m/s) 1.4 walking, 2.6 jogging, 4.1 running
const SHOW_PLAYER_HITBOX = false;

export type PlayerProps = {
  children: ReactNode[] | ReactNode;
  pos?: number[];
  rot?: number;
  speed?: number;
  controls?: {
    disableGyro?: boolean;
  };
};

/**
 * Player represents a user controlled entity, complete with a
 * control scheme and a physical representation that interacts with other physics-
 * enabled objects.
 *
 * @constructor
 */
export function Player(props: PlayerProps) {
  const {
    children,
    pos = [0, 1, 0],
    rot = 0,
    speed = SPEED,
    controls = {
      disableGyro: true,
    },
  } = props;

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

  const bob = useBob(velocity, direction);

  // initial rotation
  useEffect(() => {
    // rotation happens before position move
    camera.rotation.setFromQuaternion(
      new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), rot)
    );
  }, []);

  useEffect(() => {
    const unsubPos = bodyApi.position.subscribe((p) =>
      position.current.fromArray(p)
    );
    const unsubVel = bodyApi.velocity.subscribe((v) =>
      velocity.current.fromArray(v)
    );
    return () => {
      unsubPos();
      unsubVel();
    };
  }, [bodyApi, bodyApi.position, bodyApi.velocity]);

  useFrame(({ clock }) => {
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
      bob.update(clock);
    }
  });

  const setPosition = useCallback(
    (pos: Vector3) => {
      bodyApi.position.set(pos.x, pos.y, pos.z);
      position.current.copy(pos);
    },
    [bodyApi.position]
  );

  const setVelocity = useCallback(
    (vel: Vector3) => {
      bodyApi.velocity.set(vel.x, vel.y, vel.z);
      velocity.current.copy(vel);
    },
    [bodyApi.velocity]
  );

  const controlLock = useControlLock(lockControls);

  const value = {
    position: {
      get: () => position.current.clone(),
      set: setPosition,
    },
    velocity: {
      get: () => velocity.current.clone(),
      set: setVelocity,
    },
    controls: controlLock,
    raycaster: device.mobile ? defaultRaycaster : raycaster,
  };

  return (
    <PlayerContext.Provider value={value}>
      {device.mobile && (
        <>
          {controls?.disableGyro && <TouchFPSCamera />}
          {!controls?.disableGyro && (
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
