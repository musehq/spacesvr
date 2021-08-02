import { DefaultXRControllers, useController, useXR } from "@react-three/xr";
import { MutableRefObject, useRef } from "react";
import { Vector3, XRHandedness } from "three";
import { useFrame } from "@react-three/fiber";

type SnapTurnProps = {
  hand?: XRHandedness;
  increment?: number;
  threshold?: number;
};

type SmoothLocomotionProps = {
  hand?: XRHandedness;
  speed?: number;
  direction: MutableRefObject<Vector3>;
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

const SnapTurn = (props: SnapTurnProps) => {
  const { hand = "right", increment = Math.PI / 6, threshold = 0.8 } = props;

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

const SmoothLocomotion = (props: SmoothLocomotionProps) => {
  const { hand = "left", direction } = props;

  const controller = useController(hand);

  useFrame(() => {
    if (controller && controller.inputSource.gamepad) {
      const [, , x, y] = controller.inputSource.gamepad.axes;
      direction.current.x = x;
      direction.current.y = y;
    }
  });

  return null;
};

const VRControllerMovement = (props: VRControllerMovementProps) => {
  const { position, direction, snapTurn, smoothLocomotion } = props;
  const { player } = useXR();

  useFrame(() => {
    player.position.copy(position.current);

    // average human height is ~1.7, player height is 1.
    // set to 0 fixes it i guess
    player.position.y = 0;
  });

  return (
    <group>
      <SnapTurn {...snapTurn} />
      <SmoothLocomotion {...smoothLocomotion} direction={direction} />
      <DefaultXRControllers />
    </group>
  );
};

export default VRControllerMovement;
