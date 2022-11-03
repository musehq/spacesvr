import { useCallback, useEffect, useRef, useState } from "react";
import { Vector2 } from "three";
import { useThree } from "@react-three/fiber";

export type Drag = {
  startDrag: (e: TouchEvent) => void;
  moveDrag: (e: TouchEvent) => void;
  endDrag: (e: TouchEvent) => void;
};

type DragPayload = {
  e: TouchEvent;
  touch: Touch;
  downPoint: Vector2;
  dragPoint: Vector2;
  velocity: Vector2;
};

type MovedDragPayload = DragPayload & { delta: Vector2 };

type DragCallback = (d: DragPayload) => void;
type MovedDragCallback = (d: MovedDragPayload) => void;

export const useDrag = (
  callback: {
    onStart?: DragCallback;
    onMove?: MovedDragCallback;
    onEnd?: MovedDragCallback;
  },
  domElem?: HTMLElement
): Drag => {
  const { clock, size, viewport } = useThree();

  const [downPoint] = useState(new Vector2());
  const [dragPoint] = useState(new Vector2());
  const [velocity] = useState(new Vector2());
  const [delta] = useState(new Vector2());

  const lastTouchRead = useRef(0);

  const aspect = size.width / viewport.width;

  const startDrag = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      downPoint.set(touch.clientX, touch.clientY);

      if (callback.onStart) {
        callback.onStart({ e, touch, downPoint, dragPoint, velocity });
      }
    },
    [callback, downPoint, dragPoint, velocity]
  );

  const moveDrag = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      dragPoint.set(touch.clientX, touch.clientY);
      const delta = dragPoint.sub(downPoint);

      const time = clock.getElapsedTime();
      const elapsed = time - lastTouchRead.current;
      velocity.set(delta.x / elapsed / aspect, delta.y / elapsed / aspect);
      lastTouchRead.current = time;

      if (callback.onMove) {
        callback.onMove({ e, touch, downPoint, dragPoint, velocity, delta });
      }
    },
    [aspect, callback, clock, downPoint, dragPoint, velocity]
  );

  const endDrag = useCallback(
    (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      dragPoint.set(touch.clientX, touch.clientY);
      delta.copy(dragPoint).sub(downPoint);

      if (callback.onEnd) {
        callback.onEnd({ e, touch, downPoint, dragPoint, velocity, delta });
      }
    },
    [callback, delta, downPoint, dragPoint, velocity]
  );

  useEffect(() => {
    const elem = (domElem || document) as Document;
    elem.addEventListener("touchstart", startDrag);
    elem.addEventListener("touchmove", moveDrag);
    elem.addEventListener("touchend", endDrag);
    return () => {
      elem.removeEventListener("touchstart", startDrag);
      elem.removeEventListener("touchmove", moveDrag);
      elem.removeEventListener("touchend", endDrag);
    };
  }, [domElem, moveDrag, startDrag]);

  return {
    startDrag,
    moveDrag,
    endDrag,
  };
};
