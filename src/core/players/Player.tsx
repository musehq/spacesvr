import { useRef, useEffect, useState, ReactNode, useMemo } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Raycaster, Vector3 } from "three";
import { isMobile } from "react-device-detect";
import NippleMovement from "../controls/NippleMovement";
import KeyboardMovement from "../controls/KeyboardMovement";
import PointerLockControls from "../controls/PointerLockControls";
import TouchFPSCamera from "../controls/TouchFPSCamera";
import {
  useCapsuleCollider,
  VisibleCapsuleCollider,
} from "./colliders/CapsuleCollider";
import { GyroControls } from "../controls/GyroControls";
import { useSpringVelocity } from "./utils/velocity";
import { useLimiter } from "../../services/limiter";
import { useSimulation } from "../contexts/simulation";
import { PlayerContext } from "../contexts/player";
import { createPlayerState } from "../utils/player";

const SPEED = 2.8; // (m/s) 1.4 walking, 2.2 jogging, 6.6 running
const SHOW_PLAYER_HITBOX = false;
const Z_VEC = new Vector3();

export type PlayerProps = {
  pos?: number[];
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
export default function Player(
  props: { children: ReactNode[] | ReactNode } & PlayerProps
) {
  const { children, pos = [0, 2, 0], rot = 0, speed = SPEED, controls } = props;

  const { camera, raycaster: defaultRaycaster, gl } = useThree();

  // physical body
  const [bodyRef, bodyApi] = useCapsuleCollider(pos);
  const { direction, updateVelocity } = useSpringVelocity(bodyApi, speed);

  // local state
  const [setup, setSetup] = useState(false);
  const position = useRef(new Vector3(0, 0, 0));
  const velocity = useRef(new Vector3(0, 0, 0));
  const lockControls = useRef(false);
  const raycaster = useMemo(() => new Raycaster(Z_VEC, Z_VEC, 0, 1.5), []);
  const { connected, frequency, sendEvent } = useSimulation();
  const simulationLimiter = useLimiter(frequency);

  // initial camera rotation
  // i know this is ugly but it doesn't work in the use effect
  if (!setup) {
    const xLook = pos[0] + 100 * Math.cos(rot);
    const zLook = pos[2] + 100 * Math.sin(rot);
    camera.lookAt(xLook, pos[1], zLook);
    setSetup(true);
  }

  // setup player
  useEffect(() => {
    // store position and velocity
    bodyApi.position.subscribe((p) => position.current.set(p[0], p[1], p[2]));
    bodyApi.velocity.subscribe((v) => velocity.current.set(v[0], v[1], v[2]));
  }, []);

  useFrame(({ clock }) => {
    // update raycaster
    raycaster.ray.origin.copy(position.current);
    const lookAt = new Vector3(0, 0, -1);
    lookAt.applyQuaternion(camera.quaternion);
    raycaster.ray.direction.copy(lookAt);

    // update camera position
    camera.position.copy(position.current);

    // update velocity
    if (!lockControls.current) {
      updateVelocity(camera, velocity.current);
    }

    // p2p stream position and rotation
    if (connected && simulationLimiter.isReady(clock)) {
      sendEvent(
        "player",
        JSON.stringify({
          position: camera.position,
          rotation: camera.rotation,
        })
      );
    }
  });

  const state = createPlayerState(
    bodyApi,
    position,
    velocity,
    lockControls,
    isMobile ? defaultRaycaster : raycaster
  );

  return (
    <PlayerContext.Provider value={state}>
      {isMobile ? (
        <>
          {controls?.disableGyro ? (
            <TouchFPSCamera />
          ) : (
            <GyroControls fallback={<TouchFPSCamera />} />
          )}
          <NippleMovement direction={direction} />
        </>
      ) : (
        <>
          <KeyboardMovement direction={direction} />
          <PointerLockControls />
        </>
      )}
      <mesh name="player" ref={bodyRef}>
        {SHOW_PLAYER_HITBOX && <VisibleCapsuleCollider />}
      </mesh>
      {children}
    </PlayerContext.Provider>
  );
}
