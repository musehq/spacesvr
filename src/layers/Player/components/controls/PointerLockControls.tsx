import { useEffect, useCallback, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Euler } from "three";
import { PauseEvent, useEnvironment } from "../../../Environment";

const MIN_POLAR_ANGLE = 0; // radians
const MAX_POLAR_ANGLE = Math.PI; // radians
const SENSITIVITY = 0.8;
const PI_2 = Math.PI / 2;

/**
 * PointerLockCamera is a react port of PointerLockControls.js from THREE,
 * with some changes. Some parameters are listed above
 *
 * https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/PointerLockControls.js
 *
 * @param props = { onUnlock: function to run when the pointer lock controls are unlocked }
 * @constructor
 */
export default function PointerLockCamera() {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const { domElement } = gl;
  const { paused, setPaused, events } = useEnvironment();

  const { current: euler } = useRef(new Euler(0, 0, 0, "YXZ"));
  const isLocked = useRef(false);
  const lock = () => domElement.requestPointerLock();
  const unlock = () => domElement.ownerDocument.exitPointerLock();

  // update camera while controls are locked
  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isLocked.current) return;

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

  // handle pointer lock change
  function onPointerlockChange() {
    if (domElement.ownerDocument.pointerLockElement === domElement) {
      isLocked.current = true;
      if (paused) {
        setPaused(false);
      }
    } else {
      isLocked.current = false;
      if (!paused) {
        setPaused(true);
      }
    }
  }

  // automatically unlock on pointer lock error
  function onPointerlockError() {
    console.error("PointerLockControls: Unable to use Pointer Lock API");
    isLocked.current = false;
    setPaused(true);
  }

  // events setup
  useEffect(() => {
    setTimeout(() => {
      if (!isLocked.current && !paused) {
        setPaused(true);
      }
    }, 250);

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
  }, [paused, onMouseMove, isLocked, onPointerlockChange]);

  useEffect(() => {
    // initial camera rotation
    if (camera) {
      camera?.lookAt(0, 2, 0);
    }
  }, []);

  useEffect(() => {
    const ev: PauseEvent = (p) => {
      if (p) unlock();
      else lock();
    };
    events.push(ev);
    return () => {
      const ind = events.indexOf(ev);
      if (ind >= 0) events.splice(ind, 1);
    };
  }, [events, lock, unlock]);

  return null;
}
