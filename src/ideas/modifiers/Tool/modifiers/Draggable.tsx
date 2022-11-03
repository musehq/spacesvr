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
  children: ReactNode | ReactNode[];
};

export default function Draggable(props: DraggableProps) {
  const { distance, name, children } = props;

  const toolbelt = useToolbelt();
  const { tools } = toolbelt;
  const { viewport, size, gl } = useThree();
  const { raycaster } = usePlayer();
  const { device } = useEnvironment();

  const BOTTOM_EDGE_RANGE = size.height * 0.075;
  const SIDE_EDGE_RANGE = size.width * 0.07;

  const group = useRef<Group>(null);

  const aspect = size.width / viewport.width;
  const [spring, set] = useSpring(() => ({
    offset: [0, 0, 0] as [number, number, number],
    config: { mass: 4, friction: 90, tension: 800 },
  }));

  // animate position on tool switches
  const lastActiveIndex = useRef<number>();
  useEffect(() => {
    if (lastActiveIndex.current === toolbelt.activeIndex) return;

    const thisTool = tools.find((t) => t.name == name);
    if (!thisTool) {
      lastActiveIndex.current = toolbelt.activeIndex;
      return;
    }
    const thisIndex = tools.indexOf(thisTool);
    const activeIndex = toolbelt.activeIndex;
    if (thisIndex == -1) {
      lastActiveIndex.current = activeIndex;
      return;
    }

    const x = size.width * 0.0015;

    if (activeIndex === undefined) {
      set({ offset: [0, -1, distance] });
    } else if (thisIndex === activeIndex) {
      if (lastActiveIndex.current !== undefined) {
        spring.offset.update({ immediate: true });
        set({ offset: [toolbelt.direction === "right" ? -x : x, 0, distance] });
        spring.offset.finish();
        spring.offset.update({ immediate: false });
      }
      set({ offset: [0, 0, 0] });
    } else {
      set({ offset: [toolbelt.direction === "right" ? x : -x, 0, distance] });
    }

    lastActiveIndex.current = activeIndex;
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
        if (!group.current || !device.mobile) return;
        const intersections = raycaster.intersectObject(group.current, true);
        if (intersections.length > 0) {
          valid.current = true;
          e.stopPropagation();
        } else {
          valid.current = false;
        }
      },
      onMove: ({ delta }) => {
        if (!valid.current) return;

        set({
          offset: [
            (delta.x / aspect) * distance * 0.5,
            (-delta.y / aspect) * distance * (delta.y < 0 ? 0.1 : 0.35),
            0,
          ],
        });
      },
      onEnd: ({ touch, delta }) => {
        if (!valid.current) return;

        set({ offset: [0, 0, 0] });
        const bottomEdgeDist = size.height - touch.clientY;
        const xEdgeDist = Math.min(touch.clientX, size.width - touch.clientX);

        if (
          bottomEdgeDist < BOTTOM_EDGE_RANGE &&
          delta.y > 0 &&
          Math.abs(delta.y) > Math.abs(delta.x * 0.5)
        ) {
          toolbelt.hide();
        } else if (
          xEdgeDist < SIDE_EDGE_RANGE &&
          Math.abs(delta.x) > Math.abs(delta.y * 0.5)
        ) {
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

  return (
    <group name="draggable" ref={group}>
      <animated.group position={spring.offset}>{children}</animated.group>
    </group>
  );
}
