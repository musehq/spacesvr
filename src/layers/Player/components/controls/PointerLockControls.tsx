import { useEffect, useCallback, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Euler } from "three";
import { PauseEvent, useEnvironment } from "../../../Environment";

const EPS = 0.0001;
const MIN_POLAR_ANGLE = EPS; // radians
const MAX_POLAR_ANGLE = Math.PI - EPS; // radians
const SENSITIVITY = 0.8;
const PI_2 = Math.PI / 2;

/**
 * PointerLockCamera is a react port of PointerLockControls.js from THREE,
 * with some changes. Some parameters are listed above
 *
 * https://github.com/mrdoob/three.js/blob/master/examples/jsm/controls/PointerLockControls.js
 *
 * @constructor
 */
export default function PointerLockCamera() {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const { domElement } = gl;
  const { paused, setPaused, events } = useEnvironment();

  const isLocked = useRef(false);
  const [euler] = useState(new Euler(0, 0, 0, "YXZ"));
  const isCurrentlyLocked = useCallback(
    () => domElement.ownerDocument.pointerLockElement === domElement,
    [domElement]
  );
  const leaveTime = useRef(0);

  useEffect(() => {
    // update camera while controls are locked
    const onMouseMove = (ev: MouseEvent) => {
      if (!isLocked.current) return;

      // @ts-ignore
      const dx = ev.movementX || ev.mozMovementX || ev.webkitMovementX || 0;
      // @ts-ignore
      const dy = ev.movementY || ev.mozMovementY || ev.webkitMovementY || 0;

      euler.setFromQuaternion(camera.quaternion);

      euler.y -= dx * SENSITIVITY * 0.002;
      euler.x -= dy * SENSITIVITY * 0.002;

      euler.x = Math.max(
        PI_2 - MAX_POLAR_ANGLE,
        Math.min(PI_2 - MIN_POLAR_ANGLE, euler.x)
      );

      camera.quaternion.setFromEuler(euler);
    };

    // automatically unlock on pointer lock error
    function onError() {
      isLocked.current = false;
      setPaused(true);
    }

    // handle pointer lock change
    function onChange() {
      if (isCurrentlyLocked()) {
        isLocked.current = true;
        if (paused) {
          setPaused(false);
        }
      } else {
        leaveTime.current = performance.now();
        isLocked.current = false;
        if (!paused) {
          setPaused(true);
        }
      }
    }

    const { ownerDocument } = domElement;
    ownerDocument.addEventListener("mousemove", onMouseMove);
    ownerDocument.addEventListener("pointerlockchange", onChange);
    ownerDocument.addEventListener("pointerlockerror", onError);
    return () => {
      ownerDocument.removeEventListener("mousemove", onMouseMove);
      ownerDocument.removeEventListener("pointerlockchange", onChange);
      ownerDocument.removeEventListener("pointerlockerror", onError);
    };
  }, [
    paused,
    domElement,
    setPaused,
    euler,
    camera.quaternion,
    isCurrentlyLocked,
  ]);

  // detect failed, uncaught pointer lock errors
  useEffect(() => {
    setTimeout(() => {
      if (!isLocked.current && !paused) {
        setPaused(true);
      }
    }, 250);
  }, [paused, setPaused]);

  useEffect(() => {
    const ev: PauseEvent = (paused) => {
      if (paused) {
        domElement.ownerDocument.exitPointerLock();
      } else {
        // leaving pointer lock makes you wait for 1.25s to relock, trying will throw error
        if (performance.now() - leaveTime.current > 1250) {
          domElement.requestPointerLock();
        }
      }
    };
    events.push(ev);
    return () => {
      const ind = events.indexOf(ev);
      if (ind >= 0) events.splice(ind, 1);
    };
  }, [domElement, events, isCurrentlyLocked]);

  return null;
}
