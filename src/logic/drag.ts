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
  domElem?: HTMLElement,
  deps: any[] = []
): Drag => {
  const { clock, size, viewport } = useThree();

  const aspect = size.width / viewport.width;

  const [downPoint] = useState(new Vector2());
  const [dragPoint] = useState(new Vector2());
  const [velocity] = useState(new Vector2());
  const [delta] = useState(new Vector2());

  const lastTouchRead = useRef(0);

  const onStart = useCallback<DragCallback>(
    (p) => {
      if (callback.onStart) callback.onStart(p);
    },
    [...deps]
  );

  const onMove = useCallback<MovedDragCallback>(
    (p) => {
      if (callback.onMove) callback.onMove(p);
    },
    [...deps]
  );

  const onEnd = useCallback<MovedDragCallback>(
    (p) => {
      if (callback.onEnd) callback.onEnd(p);
    },
    [...deps]
  );

  const startDrag = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      downPoint.set(touch.clientX, touch.clientY);

      onStart({
        e,
        touch,
        downPoint,
        dragPoint: downPoint,
        velocity,
      });
    },
    [onStart, downPoint, velocity]
  );

  const moveDrag = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      dragPoint.set(touch.clientX, touch.clientY);
      const delta = dragPoint.sub(downPoint);

      const time = clock.elapsedTime;
      const elapsed = time - lastTouchRead.current;
      velocity.set(delta.x / elapsed / aspect, delta.y / elapsed / aspect);
      lastTouchRead.current = time;

      onMove({ e, touch, downPoint, dragPoint, velocity, delta });
    },
    [aspect, onMove, clock, downPoint, dragPoint, velocity]
  );

  const endDrag = useCallback(
    (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      dragPoint.set(touch.clientX, touch.clientY);
      delta.copy(dragPoint).sub(downPoint);

      onEnd({ e, touch, downPoint, dragPoint, velocity, delta });
    },
    [onEnd, delta, downPoint, dragPoint, velocity]
  );

  useEffect(() => {
    const elem = (domElem || document) as HTMLElement;
    elem.addEventListener("touchstart", startDrag);
    elem.addEventListener("touchmove", moveDrag);
    elem.addEventListener("touchend", endDrag);
    return () => {
      elem.removeEventListener("touchstart", startDrag);
      elem.removeEventListener("touchmove", moveDrag);
      elem.removeEventListener("touchend", endDrag);
    };
  }, [domElem, endDrag, moveDrag, startDrag]);

  return {
    startDrag,
    moveDrag,
    endDrag,
  };
};
