import { useRef, useEffect } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Vector3 } from "three";
import { isMobile } from "react-device-detect";

import { createPlayerRef } from "../utils/player";
import { GyroControls } from "../controls/GyroControls";
import { useSphere } from "@react-three/cannon";
import DragControls from "../controls/DragControls";
import TouchFPSCamera from "../controls/TouchFPSCamera";
import { getSpringValues } from "../utils/spring";
import { AnimatedValue } from "react-spring";
import { useEnvironment } from "../utils/hooks";

const SHOW_PLAYER_HITBOX = false;

type SpringPlayerProps = {
  spring: AnimatedValue<any>;
};

/**
 * Player represents a physics-enabled player in the environment, complete with a
 * control scheme and a physical representation that interacts with other physics-
 * enabled objects.
 *
 * Spring should be stored as XYZ(S)
 *
 * There should only be one player per environment.
 *
 * @constructor
 */
const SpringPlayer = (props: SpringPlayerProps) => {
  const { spring } = props;

  const { camera, raycaster } = useThree();
  const { setPlayer } = useEnvironment();
  const [initX, initY, initZ, initS] = getSpringValues(spring);
  const initPos = new Vector3(initX * initS, initY * initS, initZ * initS);

  // physical body
  const [, bodyApi] = useSphere(() => ({
    mass: 0,
    position: initPos.toArray(),
    args: 1,
    fixedRotation: true,
  }));

  // producer
  const position = useRef(new Vector3(0, 0, 0));
  const velocity = useRef(new Vector3(0, 0, 0));
  const lockControls = useRef(false);

  // setup player
  useEffect(() => {
    bodyApi.position.subscribe((p) => {
      position.current.set(p[0], p[1], p[2]);
    });
    bodyApi.velocity.subscribe((v) => velocity.current.set(v[0], v[1], v[2]));

    const rotation = 0;
    const xLook = initPos.x + 100 * Math.cos(rotation);
    const zLook = initPos.z + 100 * Math.sin(rotation);
    camera?.lookAt(xLook, initPos.y, zLook);

    camera?.position.set(initPos.x, initPos.y, initPos.z);

    setPlayer(
      createPlayerRef(bodyApi, position, velocity, lockControls, raycaster)
    );
  }, []);

  // update player every frame
  useFrame(() => {
    const [x, y, z, s = 1] = getSpringValues(spring);
    bodyApi?.position.set(x * s, y * s, z * s);
  });

  return (
    <>
      {isMobile ? (
        <GyroControls fallback={<TouchFPSCamera />} />
      ) : (
        <DragControls />
      )}
      <mesh name="player">
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

export default SpringPlayer;
