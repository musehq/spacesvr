import { useRef, useEffect, MutableRefObject, RefObject } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Quaternion, Vector3, Vector2, Euler } from "three";

type DragFPSCameraProps = {
  quaternion: MutableRefObject<Quaternion>;
  position: MutableRefObject<Vector3>;
  nippleContainer: RefObject<HTMLElement>;
};

type Touch = {
  pos: Vector2;
  id: number;
};

const DefaultTouch = {
  pos: new Vector2(0, 0),
  id: -1,
};

const DRAG_SENSITIVITY = new Vector2(0.7, 0.7);

/**
 * TouchFPSCamera controls the camera rotation by detecting
 * touch drag on the screen. Unlike MouseFPSCamera, this component
 * does not have a way to pause, that must be done externally.
 *
 * @param props
 * @constructor
 */
const TouchFPSCamera = (props: DragFPSCameraProps) => {
  const { quaternion, position } = props;

  const touchStartPos = useRef<Touch>(DefaultTouch);
  const originEuler = useRef<Euler>(new Euler(0, 0, 0, "YXZ"));
  const { camera } = useThree();

  useFrame(() => {
    if (position.current) {
      const { x: pX, y: pY, z: pZ } = position.current;
      camera?.position?.set(pX, pY, pZ);
    }
  });

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

  const tappedNipple = (ev: TouchEvent) => {
    // get the relevant touched element (casted as an Element)
    const ele = ev.touches[ev.touches.length - 1].target as Element;
    return (
      ele.classList.contains("nipple-container") ||
      ele.classList.contains("front") ||
      ele.classList.contains("back")
    );
  };

  const getCurrentTouch = (touches: TouchList) => {
    const len = touches.length;
    for (let i = 0; i < len; i++) {
      if (touchStartPos.current.id === touches[i].identifier) {
        return touches[i];
      }
    }
    return undefined;
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
  };

  const onTouchMove = (ev: TouchEvent) => {
    const touch = getCurrentTouch(ev.touches);

    if (!touch) {
      return;
    }

    const { clientX, clientY } = touch;
    const newEuler = getNewEuler(clientX, clientY);
    camera.quaternion.setFromEuler(newEuler);
    quaternion.current = camera.quaternion;
  };
  const onTouchEnd = (ev: TouchEvent) => {
    const touch = getCurrentTouch(ev.changedTouches);

    if (!touch) {
      return;
    }

    const { clientX, clientY } = touch;
    originEuler.current = getNewEuler(clientX, clientY);
    touchStartPos.current.id = -1;
  };

  useEffect(() => {
    camera?.lookAt(0, 2, 0);
    quaternion.current = camera.quaternion;
  }, []);

  useEffect(() => {
    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  // @ts-ignore
  return <></>;
};

export default TouchFPSCamera;
