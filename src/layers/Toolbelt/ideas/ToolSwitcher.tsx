import { useRef } from "react";
import { useToolbelt } from "../index";
import { useThree } from "@react-three/fiber";
import { useDrag } from "../../../logic/drag";

export default function ToolSwitcher() {
  const toolbelt = useToolbelt();
  const { size, gl } = useThree();

  const registered = useRef(false);
  const type = useRef<"side" | "bottom">("side");

  const DETECT_RANGE_X = screen.width * 0.04;
  const DRAG_RANGE_X = screen.width * 0.08;

  const DETECT_RANGE_Y = screen.height * 0.085;
  const DRAG_RANGE_Y = screen.height * 0.17;

  const valid = useRef(false);
  useDrag(
    {
      onStart: ({ e, touch }) => {
        valid.current = false;
        if (toolbelt.activeTool !== undefined) return;

        const inBottomEdge = size.height - touch.clientY < DETECT_RANGE_Y;
        const inSideEdge =
          Math.min(touch.clientX, size.width - touch.clientX) < DETECT_RANGE_X;

        // ignore corners or no match
        if (inBottomEdge == inSideEdge) return;
        if (inBottomEdge) type.current = "bottom";
        if (inSideEdge) type.current = "side";

        valid.current = true;
        registered.current = false;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      },
      onMove: ({ delta }) => {
        if (!valid.current || registered.current) return;

        if (type.current == "bottom" && delta.y < -DRAG_RANGE_Y) {
          registered.current = true;
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

        if (type.current == "side" && Math.abs(delta.x) > DRAG_RANGE_X) {
          registered.current = true;
          if (delta.x > 0) {
            toolbelt.next();
          } else {
            toolbelt.prev();
          }
        }
      },
    },
    gl.domElement
  );

  return null;
}
