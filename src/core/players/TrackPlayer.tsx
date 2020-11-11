import { useRef, useEffect } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Quaternion, Raycaster, Vector3 } from "three";
import { useSphere } from "@react-three/cannon";
import { isMobile } from "react-device-detect";

import { useEnvironment } from "../utils/hooks";
import { createPlayerRef } from "../utils/player";
import { DeviceOrientationControls } from "three/examples/jsm/controls/DeviceOrientationControls";
import MouseFPSCamera from "../controls/MouseFPSCamera";

const SHOW_PLAYER_HITBOX = false;

export type PlayerProps = {
  initPos?: Vector3;
  initRot?: number;
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
const TrackPlayer = (props: PlayerProps) => {
  const { initPos = new Vector3(0, 1, 0), initRot = 0 } = props;
  const { camera } = useThree();
  const { setPlayer } = useEnvironment();

  // physical body
  const [bodyRef, bodyApi] = useSphere(() => ({
    mass: 500,
    position: initPos.toArray(),
    args: 1,
    fixedRotation: true,
  }));

  // producer
  const position = useRef(new Vector3(0, 0, 0));
  const velocity = useRef(new Vector3(0, 0, 0));
  const lockControls = useRef(false);
  const raycaster = useRef(new Raycaster(new Vector3(), new Vector3(), 0, 3));

  // consumer
  const quaternion = useRef(new Quaternion(0, 0, 0, 0)); // rad on y axis

  const controls = useRef<DeviceOrientationControls>();

  // setup player
  useEffect(() => {
    // store position and velocity
    bodyApi.position.subscribe((p) => {
      position.current.set(p[0], p[1], p[2]);
    });
    bodyApi.velocity.subscribe((v) => velocity.current.set(v[0], v[1], v[2]));

    const xLook = initPos.x + 100 * Math.cos(initRot);
    const zLook = initPos.z + 100 * Math.sin(initRot);
    camera?.lookAt(xLook, initPos.y, zLook);

    if (isMobile) {
      window.addEventListener("click", () => {
        controls.current = new DeviceOrientationControls(camera);
      });
    }

    setPlayer(
      createPlayerRef(bodyApi, position, velocity, lockControls, raycaster)
    );
  }, []);

  // update player every frame
  useFrame(({ clock }) => {
    if (isMobile && controls.current) {
      controls.current.update();
    }

    const dist = (22 + 50) / 2;
    const x = dist * Math.cos(clock.getElapsedTime() / 10);
    const z = dist * Math.sin(clock.getElapsedTime() / 10);
    camera.position.set(x, 2, z);
    return;
  });

  return (
    <>
      {!isMobile && (
        <MouseFPSCamera quaternion={quaternion} position={position} />
      )}
      <mesh ref={bodyRef} name="player">
        {SHOW_PLAYER_HITBOX && (
          <>
            <sphereBufferGeometry attach="geometry" args={[1]} />
            <meshPhongMaterial attach="material" color="#172017" />
          </>
        )}
      </mesh>
    </>
  );
};

export default TrackPlayer;
