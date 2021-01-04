import { useCallback, useEffect, useRef, useState } from "react";
import { Vector2 } from "three";
import DragControls from "./DragControls";
import PointerLockCamera from "./PointerLockCamera";

const ClickDragControls = () => {
  const [dragging, setDragging] = useState(true);
  const mouseDownPos = useRef<Vector2>(new Vector2(0, 0));

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      mouseDownPos.current.set(e.clientX, e.clientY);
    },
    [dragging]
  );

  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      const dist = mouseDownPos.current.distanceTo(
        new Vector2(e.clientX, e.clientY)
      );
      if (dist < 4 && dragging) {
        setDragging(false);
      }
      mouseDownPos.current.set(e.clientX, e.clientY);
    },
    [dragging]
  );

  useEffect(() => {
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  const onUnlock = () => setDragging(true);

  return (
    <>
      {dragging && <DragControls />}
      {!dragging && <PointerLockCamera onUnlock={onUnlock} />}
    </>
  );
};

export default ClickDragControls;
