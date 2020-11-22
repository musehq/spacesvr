import { useController } from "@react-three/xr";
import { MutableRefObject } from "react";
import { Group, Quaternion, Vector3 } from "three";
import { useFrame, useThree } from "react-three-fiber";

type VRControllerMovementProps = {
  quaternion: MutableRefObject<Quaternion>;
  direction: MutableRefObject<Vector3>;
  camParent: MutableRefObject<Group>;
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

  const left = useController("left");
  const right = useController("right");

  useFrame(() => {
    if (!gl.xr.isPresenting) {
      return;
    }
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
    quaternion.current = gl.xr.getCamera(camera).quaternion;
  });

  return <></>;
};

export default VRControllerMovement;
