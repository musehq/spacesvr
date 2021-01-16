import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Camera, Quaternion, Raycaster, Vector3 } from "three";
import { isMobile } from "react-device-detect";

import { useEnvironment } from "../utils/hooks";
import { createPlayerRef } from "../utils/player";
import NippleMovement from "../controls/NippleMovement";
import KeyboardMovement from "../controls/KeyboardMovement";
import PointerLockControls from "../controls/PointerLockControls";
import TouchFPSCamera from "../controls/TouchFPSCamera";
import {
  useCapsuleCollider,
  VisibleCapsuleCollider,
} from "./colliders/CapsuleCollider";
import { GyroControls } from "../controls/GyroControls";
import VRControllerMovement from "../controls/VRControllerMovement";
import { DefaultXRControllers } from "@react-three/xr";

const SPEED = 3.5; // (m/s) 1.4 walking, 2.2 jogging, 6.6 running
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
const Player = (props: PlayerProps) => {
  const { initPos = new Vector3(0, 0, 0), initRot = 0 } = props;
  const { camera, raycaster: defaultRaycaster, gl } = useThree();
  const { device, setDevice, paused, setPlayer } = useEnvironment();

  // physical body
  const [bodyRef, bodyApi] = useCapsuleCollider({ initPos });

  // producer
  const position = useRef(new Vector3(0, 0, 0));
  const velocity = useRef(new Vector3(0, 0, 0));
  const lockControls = useRef(false);
  const [raycaster] = useState(
    isMobile
      ? defaultRaycaster
      : new Raycaster(new Vector3(), new Vector3(), 0, 3)
  );

  // consumer
  const direction = useRef(new Vector3());
  const quaternion = useRef(new Quaternion(0, 0, 0, 0)); // rad on y axis

  // setup player
  useEffect(() => {
    // store position and velocity
    bodyApi.position.subscribe((p) => position.current.set(p[0], p[1], p[2]));
    bodyApi.velocity.subscribe((v) => velocity.current.set(v[0], v[1], v[2]));

    const xLook = initPos.x + 100 * Math.cos(initRot);
    const zLook = initPos.z + 100 * Math.sin(initRot);
    camera?.lookAt(xLook, initPos.y, zLook);

    // set player for environment
    setPlayer(
      createPlayerRef(bodyApi, position, velocity, lockControls, raycaster)
    );
  }, []);

  // update player every frame
  useFrame((_, delta) => {
    if (gl.xr.isPresenting && device !== "xr") {
      setDevice("xr");
    }

    const cam: Camera = device === "xr" ? gl.xr.getCamera(camera) : camera;

    // update raycaster
    if (!isMobile) {
      raycaster.ray.origin.copy(position.current);
      const lookAt = new Vector3(0, 0, -1);
      lookAt.applyQuaternion(cam.quaternion);
      raycaster.ray.direction.copy(lookAt);
    }

    // get forward/back movement and left/right movement velocities
    const inputVelocity = new Vector3(0, 0, 0);
    if (!lockControls.current && (device == "desktop" ? !paused : true)) {
      inputVelocity.x = direction.current.x * 0.75;
      inputVelocity.z = direction.current.y; // forward/back
      inputVelocity.multiplyScalar(delta * 100 * SPEED);

      const moveQuaternion = cam.quaternion.clone();
      moveQuaternion.x = 0;
      moveQuaternion.z = 0;
      inputVelocity.applyQuaternion(moveQuaternion);
      inputVelocity.y = velocity.current.y;
    }

    if (!lockControls.current) {
      // keep y velocity intact and update velocity
      bodyApi?.velocity.set(inputVelocity.x, inputVelocity.y, inputVelocity.z);
    }
  });

  return (
    <>
      {device === "mobile" && (
        <>
          <GyroControls
            quaternion={quaternion}
            position={position}
            fallback={
              <TouchFPSCamera quaternion={quaternion} position={position} />
            }
          />
          <NippleMovement direction={direction} />
        </>
      )}
      {device === "desktop" && (
        <>
          <KeyboardMovement direction={direction} />
          <PointerLockControls position={position} />
        </>
      )}
      {device === "xr" && (
        <>
          <VRControllerMovement
            position={position}
            direction={direction}
            quaternion={quaternion}
          />
          <DefaultXRControllers />
        </>
      )}
      <mesh ref={bodyRef} name="player">
        {SHOW_PLAYER_HITBOX && <VisibleCapsuleCollider />}
      </mesh>
    </>
  );
};

export default Player;
