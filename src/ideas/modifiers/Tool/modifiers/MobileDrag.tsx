import { useThree } from "@react-three/fiber";
import { ReactNode, useEffect, useRef, useState } from "react";
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

  const [text] = useState(document.createElement("h1"));

  useEffect(() => {
    text.style.position = "absolute";
    text.style.top = "" + (enabled ? 2 : 0) + "em";
    text.style.left = "0";
    text.style.color = "red";
    text.style.zIndex = "200";
    document.body.appendChild(text);
    return () => {
      document.body.removeChild(text);
    };
  }, [enabled, text]);

  useEffect(() => {
    const startTouch = (e: TouchEvent) => {
      if (!group.current || !device.mobile || !enabled) return;
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

      const vel = velocity.current.length().toFixed(2);
      console.log(vel);

      set({ offset: [(delta.x / aspect) * 0.2, (delta.y / aspect) * 0.1, 0] });

      const bottomEdgeDist = size.height - touch.clientY;
      const xEdgeDist = Math.min(touch.clientX, size.width - touch.clientX);

      // swipe down
      if (
        bottomEdgeDist < size.height * 0.075 &&
        velocity.current.y < 0 &&
        Math.abs(velocity.current.y) > Math.abs(velocity.current.x * 0.5)
      ) {
        text.innerText = "swipe down";
        toolbelt.hide();
        set({ offset: [0, 0, 0] });
        startDrag.current = undefined;
        return;
      }

      text.innerText = "" + bottomEdgeDist;

      // swipe left or right
      if (
        xEdgeDist < size.width * 0.025 &&
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
    text,
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
