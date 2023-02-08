import { useThree } from "@react-three/fiber";
import { SpringRef } from "@react-spring/three";
import { useToolbelt } from "../../../../layers/Toolbelt";
import { useEnvironment } from "../../../../layers/Environment";
import { usePlayer } from "../../../../layers/Player";
import { ReactNode, useRef } from "react";
import { useDrag } from "../../../../logic/drag";
import { Group } from "three";

type DraggableProps = {
  set: SpringRef<{ pos: [number, number, number] }>;
  distance: number;
  children: ReactNode | ReactNode[];
  enabled: boolean;
};

export default function Draggable(props: DraggableProps) {
  const { set, distance, enabled, children } = props;

  const toolbelt = useToolbelt();
  const { size, gl } = useThree();
  const { device } = useEnvironment();
  const { raycaster } = usePlayer();

  const group = useRef<Group>(null);

  const DOWN_SWIPE_DIST = size.height * 0.28;
  const SIDE_SWIPE_DIST = size.width * 0.3;

  const valid = useRef(false);
  useDrag(
    {
      onStart: ({ e }) => {
        valid.current = false;
        if (!group.current || !device.mobile || !enabled) return;
        const intersections = raycaster.intersectObject(group.current, true);
        if (intersections.length > 0) {
          valid.current = true;
          e.stopPropagation();
        }
      },
      onMove: ({ delta }) => {
        if (!valid.current) return;

        set({
          pos: [
            delta.x * 0.003 * distance * 0.7,
            -delta.y * 0.003 * distance * (delta.y < 0 ? 0.15 : 0.5),
            0,
          ],
        });
      },
      onEnd: ({ delta }) => {
        if (!valid.current) return;

        if (delta.y > DOWN_SWIPE_DIST) {
          toolbelt.hide();
        } else if (Math.abs(delta.x) > SIDE_SWIPE_DIST) {
          if (delta.x > 0) {
            toolbelt.next();
          } else {
            toolbelt.prev();
          }
        }

        set({ pos: [0, 0, 0] });
        valid.current = false;
      },
    },
    gl.domElement,
    [device.mobile, enabled, toolbelt.hide, toolbelt.next, toolbelt.prev]
  );

  return <group ref={group}>{children}</group>;
}
