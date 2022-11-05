import { useThree } from "@react-three/fiber";
import { ReactNode, useEffect, useRef } from "react";
import { animated, useSpring } from "@react-spring/three";
import { useEnvironment, usePlayer } from "../../../../layers";
import { Group, PerspectiveCamera } from "three";
import { useToolbelt } from "../../../../layers/Toolbelt";
import { useDrag } from "../../../../logic/drag";
import { getHudPos } from "../logic/screen";

type DraggableProps = {
  distance: number;
  name: string;
  enabled: boolean;
  pos: [number, number];
  children: ReactNode | ReactNode[];
};

export default function Draggable(props: DraggableProps) {
  const { distance, name, enabled, pos, children } = props;

  const toolbelt = useToolbelt();
  const { tools } = toolbelt;
  const { viewport, size, gl } = useThree();
  const { raycaster } = usePlayer();
  const { device } = useEnvironment();

  const camera = useThree((state) => state.camera);

  const DOWN_SWIPE_DIST = size.height * 0.28;
  const SIDE_SWIPE_DIST = size.width * 0.3;

  const group = useRef<Group>(null);

  const aspect = size.width / viewport.width;
  const [spring, set] = useSpring(() => ({
    offset: [0, 0, 0] as [number, number, number],
    config: { mass: 4, friction: 90, tension: 800 },
  }));

  // animate position on tool switches
  const lastActiveIndex = useRef<number>();
  useEffect(() => {
    const activeIndex = toolbelt.activeIndex;
    if (activeIndex === lastActiveIndex.current) return;
    lastActiveIndex.current = activeIndex;
    const thisTool = tools.find((t) => t.name == name);
    if (!thisTool) return;
    const thisIndex = tools.indexOf(thisTool);
    if (thisIndex == -1) return;

    const _cam = camera as PerspectiveCamera;
    const AMT = 1.5;

    if (activeIndex === undefined) {
      // hide it
      set({ offset: [0, -1, distance] });
    } else if (thisIndex === activeIndex) {
      // show it
      if (toolbelt.direction !== "up") {
        // unless the tool was hidden as will fly in bottom to top,
        const { x: leftX } = getHudPos([-AMT, 0], _cam, distance);
        const { x: rightX } = getHudPos([AMT, 0], _cam, distance);
        const { x } = getHudPos(pos, _cam, distance);

        const swipeInX = (toolbelt.direction === "left" ? rightX : leftX) + x;
        spring.offset.update({ immediate: true });
        set({ offset: [swipeInX, 0, distance] });
        spring.offset.finish();
        spring.offset.update({ immediate: false });
      }

      set({ offset: [0, 0, 0] });
    } else {
      // swipe it away
      const { x: leftX } = getHudPos([-AMT, 0], _cam, distance * 2);
      const { x: rightX } = getHudPos([AMT, 0], _cam, distance * 2);
      const { x } = getHudPos(pos, _cam, distance);
      const swipeOutX = (toolbelt.direction === "left" ? leftX : rightX) - x;
      set({ offset: [swipeOutX, 0, 0] });
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
    camera,
    pos,
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
