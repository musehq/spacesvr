import { useThree } from "@react-three/fiber";
import { ReactNode, useEffect, useRef } from "react";
import { animated, useSpring } from "@react-spring/three";
import { useEnvironment, usePlayer } from "../../../../layers";
import { Group } from "three";
import { useToolbelt } from "../../../../layers/Toolbelt";
import { useDrag } from "../../../../logic/drag";

type DraggableProps = {
  distance: number;
  name: string;
  enabled: boolean;
  children: ReactNode | ReactNode[];
};

export default function Draggable(props: DraggableProps) {
  const { distance, name, enabled, children } = props;

  const toolbelt = useToolbelt();
  const { tools } = toolbelt;
  const { viewport, size, gl } = useThree();
  const { raycaster } = usePlayer();
  const { device } = useEnvironment();

  const DOWN_SWIPE_DIST = size.height * 0.28;
  const SIDE_SWIPE_DIST = size.width * 0.3;

  const group = useRef<Group>(null);

  const aspect = size.width / viewport.width;
  const [spring, set] = useSpring(() => ({
    offset: [0, 0, 0] as [number, number, number],
    config: { mass: 4, friction: 90, tension: 800 },
  }));

  // animate position on tool switches
  useEffect(() => {
    const thisTool = tools.find((t) => t.name == name);
    if (!thisTool) return;
    const thisIndex = tools.indexOf(thisTool);
    const activeIndex = toolbelt.activeIndex;
    if (thisIndex == -1) return;

    const x = size.width * 0.0015;

    if (activeIndex === undefined) {
      set({ offset: [0, -1, distance] });
    } else if (thisIndex === activeIndex) {
      if (toolbelt.direction !== "up") {
        spring.offset.update({ immediate: true });
        set({ offset: [toolbelt.direction === "right" ? -x : x, 0, distance] });
        spring.offset.finish();
        spring.offset.update({ immediate: false });
      }
      set({ offset: [0, 0, 0] });
    } else {
      set({ offset: [toolbelt.direction === "right" ? x : -x, 0, distance] });
    }
  }, [
    name,
    set,
    toolbelt.activeIndex,
    tools,
    size.width,
    toolbelt.direction,
    distance,
    spring.offset,
  ]);

  // handle the mobile drag for interactivity and gestures
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

        console.log(size.width);

        set({
          offset: [
            (delta.x / aspect) * distance * 0.7,
            (-delta.y / aspect) * distance * (delta.y < 0 ? 0.15 : 0.5),
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

        set({ offset: [0, 0, 0] });
        valid.current = false;
      },
    },
    gl.domElement
  );

  return (
    <group name="draggable" ref={group}>
      <animated.group position={spring.offset}>{children}</animated.group>
    </group>
  );
}
