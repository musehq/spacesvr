import { useEffect, useCallback, useState, useMemo } from "react";
import { useThree } from "react-three-fiber";
import { Euler } from "three";

type MouseFPSCameraProps = {
  onUnlock: () => void;
};

const MIN_POLAR_ANGLE = 0; // radians
const MAX_POLAR_ANGLE = Math.PI; // radians
const SENSITIVITY = 0.8;
const PI_2 = Math.PI / 2;

/**
 * MouseFPSCamera controls the camera rotation, set up as a first
 * person view. It takes care of user input to set the camera rotation
 * and passed the quaternion of the camera up. Its position is attached
 * to the passed position, probably the player's position.
 *
 * @param props
 * @constructor
 */
const PointerLockCamera = (props: MouseFPSCameraProps) => {
  const { onUnlock } = props;

  const { camera, gl } = useThree();
  const { domElement } = gl;

  const euler = useMemo(() => new Euler(0, 0, 0, "YXZ"), []);
  const [isLocked, setIsLocked] = useState(false);
  const lock = () => domElement.requestPointerLock();
  const unlock = () => domElement.ownerDocument.exitPointerLock();

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isLocked) return;

      const movementX =
        // @ts-ignore
        event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      const movementY =
        // @ts-ignore
        event.movementY || event.mozMovementY || event.webkitMovementY || 0;

      euler.setFromQuaternion(camera.quaternion);

      euler.y -= movementX * SENSITIVITY * 0.002;
      euler.x -= movementY * SENSITIVITY * 0.002;

      euler.x = Math.max(
        PI_2 - MAX_POLAR_ANGLE,
        Math.min(PI_2 - MIN_POLAR_ANGLE, euler.x)
      );

      camera.quaternion.setFromEuler(euler);
    },
    [isLocked]
  );

  function onPointerlockChange() {
    if (domElement.ownerDocument.pointerLockElement === domElement) {
      setIsLocked(true);
    } else {
      setIsLocked(false);
      onUnlock();
    }
  }

  function onPointerlockError() {
    console.error("PointerLockControls: Unable to use Pointer Lock API");
    setIsLocked(false);
    onUnlock();
  }

  // event setup
  useEffect(() => {
    const { ownerDocument } = domElement;

    ownerDocument.addEventListener("mousemove", onMouseMove, false);
    ownerDocument.addEventListener(
      "pointerlockchange",
      onPointerlockChange,
      false
    );
    ownerDocument.addEventListener(
      "pointerlockerror",
      onPointerlockError,
      false
    );

    return () => {
      ownerDocument.removeEventListener("mousemove", onMouseMove, false);
      ownerDocument.removeEventListener(
        "pointerlockchange",
        onPointerlockChange,
        false
      );
      ownerDocument.removeEventListener(
        "pointerlockerror",
        onPointerlockError,
        false
      );
    };
  }, [isLocked]);

  lock();

  return null;
};

export default PointerLockCamera;
