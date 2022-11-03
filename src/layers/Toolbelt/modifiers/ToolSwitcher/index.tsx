import { useCallback, useEffect, useRef } from "react";
import { Vector2 } from "three";
import { useToolbelt } from "../../index";
import { useThree } from "@react-three/fiber";
import { useEnvironment } from "../../../Environment";

export default function ToolSwitcher() {
  const toolbelt = useToolbelt();
  const { viewport, size, clock, gl } = useThree();
  const { device } = useEnvironment();

  const startDrag = useRef<Vector2>();
  const velocity = useRef<Vector2>(new Vector2());
  const lastTouchRead = useRef(0);
  const switched = useRef(false);

  const aspect = size.width / viewport.width;

  const RANGE_X = screen.width * 0.075; // 7.5% on each edge
  const RANGE_Y = screen.height * 0.07;

  const moveTouch = useCallback(
    (e: TouchEvent) => {
      if (!startDrag.current || !device.mobile || switched.current) return;
      const touch = e.touches[0];
      const endDrag = new Vector2(touch.clientX, touch.clientY);
      const delta = endDrag.sub(startDrag.current);

      const time = clock.getElapsedTime();
      const elapsed = time - lastTouchRead.current;
      velocity.current.set(
        delta.x / elapsed / aspect,
        delta.y / elapsed / aspect
      );
      lastTouchRead.current = time;

      if (delta.y < -RANGE_Y * 2 && velocity.current.y < 0) {
        switched.current = true;
        if (toolbelt.activeTool) {
          const i = toolbelt.tools.findIndex(
            (t) => t.name === toolbelt.activeTool?.name
          );
          const newIndex = (i + 1) % toolbelt.tools.length;
          toolbelt.setActiveIndex(newIndex);
        } else {
          toolbelt.setActiveIndex(0);
        }
      }
    },
    [RANGE_X, clock, device.mobile, toolbelt]
  );

  useEffect(() => {
    const startTouch = (e: TouchEvent) => {
      if (!device.mobile || toolbelt.activeTool !== undefined) return;
      switched.current = false;
      startDrag.current = undefined;
      const touch = e.touches[0];
      // get bottom edge
      const inEdge = size.height - touch.clientY < RANGE_Y;
      if (!inEdge) return;
      startDrag.current = new Vector2(touch.clientX, touch.clientY);
      lastTouchRead.current = clock.getElapsedTime();
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    gl.domElement.addEventListener("touchstart", startTouch);
    gl.domElement.addEventListener("touchmove", moveTouch);
    return () => {
      gl.domElement.removeEventListener("touchstart", startTouch);
      gl.domElement.removeEventListener("touchmove", moveTouch);
    };
  }, [
    device,
    aspect,
    gl.domElement,
    clock,
    size.width,
    size.height,
    toolbelt,
    RANGE_X,
    moveTouch,
  ]);

  return null;
}
