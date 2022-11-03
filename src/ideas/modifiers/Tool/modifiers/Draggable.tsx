import { useThree } from "@react-three/fiber";
import { ReactNode, useEffect, useRef } from "react";
import { animated, useSpring } from "@react-spring/three";
import { useEnvironment, usePlayer } from "../../../../layers";
import { Group, Vector2 } from "three";
import { useToolbelt } from "../../../../layers/Toolbelt";

type DraggableProps = {
  distance: number;
  name: string;
  children: ReactNode | ReactNode[];
};

export default function Draggable(props: DraggableProps) {
  const { distance, name, children } = props;

  const toolbelt = useToolbelt();
  const { tools } = toolbelt;
  const { viewport, size, clock, gl } = useThree();
  const { raycaster } = usePlayer();
  const { device } = useEnvironment();

  const startDrag = useRef<Vector2>();
  const velocity = useRef<Vector2>(new Vector2());
  const lastTouchRead = useRef(0);

  const group = useRef<Group>(null);

  const aspect = size.width / viewport.width;
  const [spring, set] = useSpring(() => ({
    offset: [0, 0, 0] as [number, number, number],
    config: { mass: 4, friction: 90, tension: 800 },
  }));

  const lastActiveIndex = useRef<number>();
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

  useEffect(() => {
    if (!device.mobile) return;

    const startTouch = (e: TouchEvent) => {
      if (!group.current || !device.mobile) return;
      const intersections = raycaster.intersectObject(group.current, true);
      if (intersections.length > 0) {
        const touch = e.touches[0];
        startDrag.current = new Vector2(touch.clientX, touch.clientY);
        lastTouchRead.current = clock.getElapsedTime();
        e.stopPropagation();
      }
    };

    const moveTouch = (e: TouchEvent) => {
      if (!startDrag.current || !device.mobile) return;
      const touch = e.touches[0];
      const endDrag = new Vector2(touch.clientX, touch.clientY);
      const delta = endDrag.sub(startDrag.current);
      delta.y *= -1;

      const time = clock.getElapsedTime();
      const elapsed = time - lastTouchRead.current;
      velocity.current.set(
        delta.x / elapsed / aspect,
        delta.y / elapsed / aspect
      );
      lastTouchRead.current = time;

      set({
        offset: [
          (delta.x / aspect) * distance * 0.5,
          (delta.y / aspect) * distance * (delta.y > 0 ? 0.1 : 0.35),
          0,
        ],
      });
    };

    const endTouch = (e: TouchEvent) => {
      if (!startDrag.current || !device.mobile) return;
      const touch = e.changedTouches[0];

      set({ offset: [0, 0, 0] });

      // swipe down
      const bottomEdgeDist = size.height - touch.clientY;
      if (
        bottomEdgeDist < size.height * 0.075 &&
        velocity.current.y < 0 &&
        Math.abs(velocity.current.y) > Math.abs(velocity.current.x * 0.5)
      ) {
        toolbelt.hide();
        startDrag.current = undefined;
        return;
      }

      // swipe left or right
      const xEdgeDist = Math.min(touch.clientX, size.width - touch.clientX);
      if (
        xEdgeDist < size.width * 0.07 &&
        Math.abs(velocity.current.x) > Math.abs(velocity.current.y * 0.5)
      ) {
        if (velocity.current.x > 0) {
          toolbelt.next();
        } else {
          toolbelt.prev();
        }
        startDrag.current = undefined;
        return;
      }
    };

    gl.domElement.addEventListener("touchstart", startTouch);
    gl.domElement.addEventListener("touchmove", moveTouch);
    gl.domElement.addEventListener("touchend", endTouch);
    return () => {
      gl.domElement.removeEventListener("touchstart", startTouch);
      gl.domElement.removeEventListener("touchmove", moveTouch);
      gl.domElement.removeEventListener("touchend", endTouch);
    };
  }, [
    aspect,
    clock,
    device.mobile,
    distance,
    gl.domElement,
    raycaster,
    set,
    size.height,
    size.width,
    toolbelt,
  ]);

  return (
    <group name="draggable" ref={group}>
      <animated.group position={spring.offset}>{children}</animated.group>
    </group>
  );
}
