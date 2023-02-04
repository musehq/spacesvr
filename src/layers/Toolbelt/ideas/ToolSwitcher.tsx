import { useRef } from "react";
import { useToolbelt } from "../logic/toolbelt";
import { useThree } from "@react-three/fiber";
import { useDrag } from "../../../logic/drag";

export default function ToolSwitcher() {
  const toolbelt = useToolbelt();
  const { size, gl } = useThree();

  const registered = useRef(false);

  const DETECT_RANGE_X = screen.width * 0.04;
  const DRAG_RANGE_X = screen.width * 0.08;
  const DETECT_RANGE_Y = screen.height * 0.5;

  const valid = useRef(false);
  useDrag(
    {
      onStart: ({ e, touch }) => {
        valid.current = false;

        const inSideEdge =
          Math.min(touch.clientX, size.width - touch.clientX) < DETECT_RANGE_X;
        const inTopThird = touch.clientY < DETECT_RANGE_Y;

        // ignore if not in top third or side edge
        if (!inSideEdge || !inTopThird) return;

        valid.current = true;
        registered.current = false;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      },
      onMove: ({ delta }) => {
        if (!valid.current || registered.current) return;

        if (Math.abs(delta.x) > DRAG_RANGE_X) {
          registered.current = true;
          if (delta.x > 0) {
            toolbelt.next();
          } else {
            toolbelt.prev();
          }
        }
      },
    },
    gl.domElement,
    [screen.width, screen.height, toolbelt.next, toolbelt.prev]
  );

  return null;
}
