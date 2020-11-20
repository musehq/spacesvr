import { useRef, useEffect } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Quaternion, Raycaster, Vector3 } from "three";
import { isMobile } from "react-device-detect";

import { useTrackEnvironment } from "../utils/hooks";
import { createPlayerRef } from "../utils/player";
import { GyroControls } from "../controls/GyroControls";
import { useSphere } from "@react-three/cannon";
import DragControls from "../controls/DragControls";

const SHOW_PLAYER_HITBOX = false;

type TrackPlayerProps = {
  spring: any;
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
const TrackPlayer = (props: TrackPlayerProps) => {
  const { spring } = props;

  const { camera } = useThree();
  const { setPlayer, keyframes } = useTrackEnvironment();

  const scale = keyframes.currentFrame.scale || 1;
  const keyframePos = keyframes.currentFrame.position;

  // physical body
  const [bodyRef, bodyApi] = useSphere(() => ({
    mass: 0,
    position: [
      keyframePos.x * scale,
      keyframePos.y * scale,
      keyframePos.z * scale,
    ],
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

  // setup player
  useEffect(() => {
    bodyApi.position.subscribe((p) => {
      position.current.set(p[0], p[1], p[2]);
    });
    bodyApi.velocity.subscribe((v) => velocity.current.set(v[0], v[1], v[2]));

    const { position: keyframePosition, scale = 1 } = keyframes.currentFrame;
    const rotation = 0;
    const xLook = keyframePosition.x + 100 * Math.cos(rotation);
    const zLook = keyframePosition.z + 100 * Math.sin(rotation);
    camera?.lookAt(xLook, keyframePosition.y, zLook);

    camera?.position.set(
      keyframePosition.x * scale,
      keyframePosition.y * scale,
      keyframePosition.z * scale
    );

    setPlayer(
      createPlayerRef(bodyApi, position, velocity, lockControls, raycaster)
    );
  }, []);

  // update player every frame
  useFrame(({ clock }) => {
    // @ts-ignore
    const newVals = spring.xyzs.interpolate((x, y, z, s) => [x, y, z, s]);
    // @ts-ignore
    const newX = newVals.payload[0].value;
    // @ts-ignore
    const xVel = newVals.payload[0].lastVelocity || 0;
    // @ts-ignore
    const newY = newVals.payload[1].value;
    // @ts-ignore
    const yVel = newVals.payload[1].lastVelocity || 0;
    // @ts-ignore
    const newZ = newVals.payload[2].value;
    // @ts-ignore
    const zVel = newVals.payload[2].lastVelocity || 0;
    // @ts-ignore
    const newS = newVals.payload[3].value;
    // @ts-ignore
    const sVel = newVals.payload[3].lastVelocity || 0;

    bodyApi?.position.set(newX * newS, newY * newS, newZ * newS);

    return;
  });

  return (
    <>
      {isMobile ? (
        <GyroControls />
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

export default TrackPlayer;
