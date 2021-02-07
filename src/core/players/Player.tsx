import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Camera, Raycaster, Vector3 } from "three";
import { isMobile } from "react-device-detect";
import { useEnvironment } from "../utils/hooks";
import { createPlayerRef } from "../utils/player";
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

const SPEED = 2.8; // (m/s) 1.4 walking, 2.2 jogging, 6.6 running
const SHOW_PLAYER_HITBOX = false;

export type PlayerProps = {
  initPos?: Vector3;
  initRot?: number;
  speed?: number;
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
  const { initPos = new Vector3(0, 0, 0), initRot = 0, speed = SPEED } = props;
  const { camera, raycaster: defaultRaycaster, gl } = useThree();
  const { device, setDevice, setPlayer } = useEnvironment();

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

  const xLook = initPos.x + 100 * Math.cos(initRot);
  const zLook = initPos.z + 100 * Math.sin(initRot);
  camera?.lookAt(xLook, initPos.y, zLook);
  camera.position.copy(initPos);

  // setup player
  useEffect(() => {
    // store position and velocity
    bodyApi.position.subscribe((p) => position.current.set(p[0], p[1], p[2]));
    bodyApi.velocity.subscribe((v) => velocity.current.set(v[0], v[1], v[2]));

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

    // update camera position
    camera.position.copy(position.current);

    // get forward/back movement and left/right movement velocities
    const inputVelocity = new Vector3(0, 0, 0);
    if (!lockControls.current) {
      inputVelocity.x = direction.current.x * 0.75;
      inputVelocity.z = direction.current.y; // forward/back
      inputVelocity.multiplyScalar(delta * 100 * speed);

      const moveQuaternion = cam.quaternion.clone();
      moveQuaternion.x = 0;
      moveQuaternion.z = 0;
      inputVelocity.applyQuaternion(moveQuaternion);
      inputVelocity.y = Math.min(velocity.current.y, 0);
    }

    if (!lockControls.current) {
      // keep y velocity intact and update velocity
      bodyApi?.velocity.set(inputVelocity.x, inputVelocity.y, inputVelocity.z);
    }
  });

  useFrame(({ gl, scene, camera }) => gl.render(scene, camera), 100);

  return (
    <>
      {device === "mobile" && (
        <>
          <GyroControls fallback={<TouchFPSCamera />} />
          <NippleMovement direction={direction} />
        </>
      )}
      {device === "desktop" && (
        <>
          <KeyboardMovement direction={direction} />
          <ClickDragControls />
        </>
      )}
      {device === "xr" && (
        <>
          <VRControllerMovement position={position} direction={direction} />
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
