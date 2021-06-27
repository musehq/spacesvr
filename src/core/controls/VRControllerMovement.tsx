import { DefaultXRControllers, useController, useXR } from "@react-three/xr";
import { MutableRefObject, useRef } from "react";
import { Vector3, Vector2, XRHandedness } from "three";
import { useFrame } from "@react-three/fiber";

const MOVEMENT_SPEED = 2;

type SnapTurnProps = {
  hand?: XRHandedness;
  increment?: number;
  threshold?: number;
};

type SmoothLocomotionProps = {
  hand?: XRHandedness;
  speed?: number;
};

type VRControllerMovementProps = {
  position: MutableRefObject<Vector3>;
  direction: MutableRefObject<Vector3>;
  snapTurn?: SnapTurnProps;
  smoothLocomotion?: SmoothLocomotionProps;
};

/**
 * VRControllerMovement gives the player a direction to move by taking
 * input from the Oculus Quest Gamepad.
 *
 *
 * @param props
 * @constructor
 */

const SnapTurn = ({
  hand = "right",
  increment = Math.PI / 6,
  threshold = 0.8,
}: SnapTurnProps) => {
  const controller = useController(hand);
  const { player } = useXR();
  const isSnapping = useRef(false);

  useFrame(() => {
    if (controller && controller.inputSource.gamepad) {
      const [, , x] = controller.inputSource.gamepad.axes;

      if (Math.abs(x) > threshold) {
        if (!isSnapping.current) {
          player.rotateY(-increment * Math.sign(x));
        }
        isSnapping.current = true;
      } else {
        isSnapping.current = false;
      }
    }
  });

  return null;
};

const SmoothLocomotion = ({
  hand = "left",
  speed = MOVEMENT_SPEED,
}: SmoothLocomotionProps) => {
  const controller = useController(hand);
  const { player } = useXR();

  const controllerDirection = new Vector2();
  const controllerDirection3 = new Vector3();
  const joystickDirection = new Vector2();

  useFrame((_, delta) => {
    if (controller && controller.inputSource.gamepad) {
      const [, , x, y] = controller.inputSource.gamepad.axes;

      joystickDirection.set(x, y);
      controller.controller.getWorldDirection(controllerDirection3);
      controllerDirection
        .set(controllerDirection3.x, -controllerDirection3.z)
        .normalize();

      player.position.x +=
        controllerDirection.cross(joystickDirection) * delta * speed;
      player.position.z -=
        controllerDirection.dot(joystickDirection) * delta * speed;
    }
  });

  return null;
};

const VRControllerMovement = (
  props: VRControllerMovementProps
): JSX.Element => {
  const { position, direction, snapTurn, smoothLocomotion } = props;
  const { player } = useXR();

  player.position.copy(position.current);

  useFrame(() => {
    position.current.copy(player.position);

    direction.current.x = player.position.x;
    direction.current.y = player.position.y;
    direction.current.z = 0;
  });

  return (
    <group>
      <SnapTurn {...snapTurn} />
      <SmoothLocomotion {...smoothLocomotion} />
      <DefaultXRControllers />
    </group>
  );
};

export default VRControllerMovement;
