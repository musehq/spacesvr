import { useThree } from "@react-three/fiber";
import { ReactNode, useEffect, useRef } from "react";
import { animated, useSpring } from "@react-spring/three";
import { useEnvironment, usePlayer } from "../../../../layers";
import { Group, Vector2 } from "three";
import { useToolbelt } from "../../../../layers/Toolbelt";
import { useLimitedFrame } from "../../../../logic";

type MobileDrag = { enabled: boolean; children: ReactNode | ReactNode[] };

export default function MobileDrag(props: MobileDrag) {
  const { enabled, children } = props;

  const toolbelt = useToolbelt();
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
    config: { mass: 2, friction: 40, tension: 800 },
  }));

  useEffect(() => {
    const startTouch = (e: TouchEvent) => {
      if (!group.current || !device.mobile || !enabled) return;
      const intersections = raycaster.intersectObject(group.current, true);
      if (intersections.length > 0) {
        const touch = e.touches[0];
        startDrag.current = new Vector2(touch.clientX, touch.clientY);
        lastTouchRead.current = clock.getElapsedTime();
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
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
      velocity.current.set(delta.x / elapsed, delta.y / elapsed);
      lastTouchRead.current = time;
      console.log(velocity.current.length().toFixed(4));

      const edgeDist = Math.min(
        Math.abs(touch.clientX),
        Math.abs(size.width - touch.clientX),
        Math.abs(touch.clientY),
        Math.abs(size.height - touch.clientY)
      );

      if (
        edgeDist < 80 &&
        velocity.current.length() > 20000 &&
        velocity.current.y < 0 &&
        Math.abs(velocity.current.y) > Math.abs(velocity.current.x * 0.1)
      ) {
        toolbelt.hide();
        set({ offset: [0, 0, 0] });
        startDrag.current = undefined;
      }

      set({ offset: [(delta.x / aspect) * 8, (delta.y / aspect) * 8, 0] });
    };

    const endTouch = (e: TouchEvent) => {
      if (!startDrag.current || !device.mobile) return;
      const touch = e.changedTouches[0];
      const endDrag = new Vector2(touch.clientX, touch.clientY);
      const delta = endDrag.sub(startDrag.current);
      console.log("final offset:");
      console.log(delta.length().toFixed(4));
      set({ offset: [0, 0, 0] });
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
    raycaster,
    device,
    set,
    aspect,
    gl.domElement,
    clock,
    size.width,
    size.height,
    toolbelt,
    enabled,
  ]);

  useLimitedFrame(1, () => {
    if (!enabled) {
      set({ offset: [0, 0, 0] });
    }
  });

  if (!device.mobile) return <>{children}</>;

  return (
    <group name="mobile-drag" ref={group}>
      <animated.group position={spring.offset}>{children}</animated.group>
    </group>
  );
}
