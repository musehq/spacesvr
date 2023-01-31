import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Vector2, Euler } from "three";
import {
  Touch,
  DefaultTouch,
  getCurrentTouch,
  tappedNipple,
} from "../../logic/touch";

const DRAG_SENSITIVITY = new Vector2(0.7, 0.7);

/**
 * TouchFPSCamera controls the camera rotation by detecting
 * touch drag on the screen. Unlike MouseFPSCamera, this component
 * does not have a way to pause, that must be done externally.
 *
 * @param props
 * @constructor
 */
export default function TouchFPSCamera() {
  const touchStartPos = useRef<Touch>(DefaultTouch);
  const originEuler = useRef<Euler>(new Euler(0, 0, 0, "YXZ"));
  const camera = useThree((state) => state.camera);

  const getNewEuler = (dragX: number, dragY: number): Euler => {
    const newEuler = originEuler.current.clone();
    const moveX = dragX - touchStartPos.current.pos.x;
    const moveY = dragY - touchStartPos.current.pos.y;

    newEuler.setFromQuaternion(camera.quaternion);
    newEuler.y = originEuler.current.y - (moveX * DRAG_SENSITIVITY.x) / 100;
    newEuler.x = originEuler.current.x - (moveY * DRAG_SENSITIVITY.y) / 100;
    newEuler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newEuler.x));

    return newEuler;
  };

  // touch move scripts
  const onTouchStart = (ev: TouchEvent) => {
    if (touchStartPos.current.id !== -1) {
      return;
    }

    if (tappedNipple(ev)) {
      touchStartPos.current = DefaultTouch;
      return;
    }

    // get last in list (most recent touch) to not confuse with movement
    const touchIndex = ev.touches.length - 1;
    const { clientX, clientY, identifier: id } = ev.touches[touchIndex];

    touchStartPos.current = { pos: new Vector2(clientX, clientY), id };

    originEuler.current.setFromQuaternion(camera.quaternion);
  };

  const onTouchMove = (ev: TouchEvent) => {
    const touch = getCurrentTouch(touchStartPos.current.id, ev.touches);

    if (!touch) return;

    const { clientX, clientY } = touch;
    const newEuler = getNewEuler(clientX, clientY);
    camera.quaternion.setFromEuler(newEuler);
  };

  const onTouchEnd = (ev: TouchEvent) => {
    const touch = getCurrentTouch(touchStartPos.current.id, ev.changedTouches);

    if (!touch) return;

    const { clientX, clientY } = touch;
    originEuler.current = getNewEuler(clientX, clientY);
    touchStartPos.current.id = -1;
  };

  useEffect(() => {
    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [onTouchEnd, onTouchMove, onTouchStart]);

  return null;
}
