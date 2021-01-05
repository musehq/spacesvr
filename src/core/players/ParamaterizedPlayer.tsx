import { useRef, useEffect } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Quaternion, Vector3 } from "three";
import { isMobile } from "react-device-detect";

import { useEnvironment } from "../utils/hooks";
import { createPlayerRef } from "../utils/player";
import { GyroControls } from "../controls/GyroControls";
import { useSphere } from "@react-three/cannon";
import DragControls from "../controls/DragControls";
import TouchFPSCamera from "../controls/TouchFPSCamera";
const SHOW_PLAYER_HITBOX = false;

type ParamaterizedPlayerProps = {
  positionFunc: (time: number) => number[];
};

/**
 *
 * Paramaterized player moves player using a given time-based function
 *
 * Player represents a physics-enabled player in the environment, complete with a
 * control scheme and a physical representation that interacts with other physics-
 * enabled objects.
 *
 * There should only be one player per environment.
 *
 * @constructor
 */
const ParamaterizedPlayer = (props: ParamaterizedPlayerProps) => {
  const { positionFunc } = props;

  const { camera, raycaster } = useThree();
  const { setPlayer } = useEnvironment();

  // physical body
  const [, bodyApi] = useSphere(() => ({
    mass: 0,
    position: [0, 0, 0],
    args: 1,
    fixedRotation: true,
  }));

  // producer
  const position = useRef(new Vector3(0, 0, 0));
  const velocity = useRef(new Vector3(0, 0, 0));
  const lockControls = useRef(false);

  // consumer
  const quaternion = useRef(new Quaternion(0, 0, 0, 0)); // rad on y axis

  // setup player
  useEffect(() => {
    bodyApi.position.subscribe((p) => {
      position.current.set(p[0], p[1], p[2]);
    });
    bodyApi.velocity.subscribe((v) => velocity.current.set(v[0], v[1], v[2]));

    const rotation = 0;
    const xLook = 100 * Math.cos(rotation);
    const zLook = 100 * Math.sin(rotation);
    camera?.lookAt(xLook, 0, zLook);

    camera?.position.set(0, 0, 0);

    setPlayer(
      createPlayerRef(bodyApi, position, velocity, lockControls, raycaster)
    );
  }, []);

  // update player every frame
  useFrame(({ clock }) => {
    if (positionFunc) {
      const [x, y, z] = positionFunc(clock.getElapsedTime());
      bodyApi?.position.set(x, y, z);
    }
  });

  return (
    <>
      {isMobile ? (
        <GyroControls
          quaternion={quaternion}
          position={position}
          fallback={
            <TouchFPSCamera quaternion={quaternion} position={position} />
          }
        />
      ) : (
        <DragControls quaternion={quaternion} position={position} />
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

export default ParamaterizedPlayer;
