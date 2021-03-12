import { useEffect, useState } from "react";
import DragControls from "./DragControls";
import PointerLockCamera from "./PointerLockCamera";

/**
 * ClickDragControls is a control scheme that mixes drag controls
 * and pointer lock controls, with a double click to switch between
 * the two
 *
 * @constructor
 */
const ClickDragControls = () => {
  const [dragging, setDragging] = useState(true);

  useEffect(() => {
    const onMouseUp = () => setDragging(!dragging);
    document.addEventListener("dblclick", onMouseUp);

    return () => {
      document.removeEventListener("dblclick", onMouseUp);
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
