import { DefaultXRControllers, useController } from "@react-three/xr";
import { MutableRefObject, useRef } from "react";
import { Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Group } from "three";

type VRControllerMovementProps = {
  position: MutableRefObject<Vector3>;
  direction: MutableRefObject<Vector3>;
};

/**
 * VRControllerMovement gives the player a direction to move by taking
 * input from the Oculus Quest Gamepad.
 *
 *
 * @param props
 * @constructor
 */

const ROTATION_SPEED = 2;
const MOVEMENT_SPEED = 1;

const VRControllerMovement = (props: VRControllerMovementProps) => {
  const { position, direction } = props;

  const camera = useThree((state) => state.camera);
  const group = useRef<Group>();

  const left = useController("left");
  const right = useController("right");

  useFrame((_, delta) => {
    if (position.current && group.current) {
      group.current.position.copy(position.current);
    }

    if (left && left.inputSource.gamepad) {
      // move the player
      const [, , x, y] = left.inputSource.gamepad.axes;

      direction.current.x = x * MOVEMENT_SPEED;
      direction.current.y = y * MOVEMENT_SPEED;
      direction.current.z = 0;
    }

    if (right && right.inputSource.gamepad) {
      // rotate the camera parent
      const [, , x] = right.inputSource.gamepad.axes;
      if (group.current) {
        group.current.rotation.y -= x * ROTATION_SPEED * delta;
      }
    }
  });

  return (
    <group ref={group}>
      <DefaultXRControllers />
      <primitive object={camera} />
    </group>
  );
};

export default VRControllerMovement;
