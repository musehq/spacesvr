import { useXR } from "@react-three/xr";
import { MutableRefObject, RefObject } from "react";
import { Group, Quaternion, Vector3 } from "three";
import { useFrame, useThree } from "react-three-fiber";

type VRControllerMovementProps = {
  quaternion: MutableRefObject<Quaternion>;
  direction: MutableRefObject<Vector3>;
  camParent: RefObject<Group>;
};

/**
 * VRControllerMovement gives the player a direction to move by taking
 * input from the Oculus Quest Gamepad.
 *
 *
 * @param props
 * @constructor
 */

const ROTATION_SPEED = 0.02;
const MOVEMENT_SPEED = 1;

const VRControllerMovement = (props: VRControllerMovementProps) => {
  const { direction, quaternion, camParent } = props;

  const { camera, gl } = useThree();
  const { controllers } = useXR();

  useFrame(() => {
    const cam = gl.xr.isPresenting ? gl.xr.getCamera(camera) : camera;
    const [left, right] = controllers || [];
    if (left) {
      // move the player
      const [, , x, y] = left.inputSource.gamepad?.axes;
      direction.current = new Vector3(
        x * MOVEMENT_SPEED,
        y * MOVEMENT_SPEED,
        0
      );
    }
    if (right) {
      // rotate the camera parent
      const [, , x] = right.inputSource.gamepad?.axes;
      if (camParent.current) {
        camParent.current.rotation.y -= x * ROTATION_SPEED;
      }
    }
    quaternion.current = cam.quaternion;
  });

  return <></>;
};

export default VRControllerMovement;
