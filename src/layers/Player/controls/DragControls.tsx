import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { config, useSpring } from "react-spring";
import { Vector2, Euler } from "three";
import { useEnvironment } from "../../Environment";

const DRAG_SENSITIVITY = new Vector2(0.16, 0.16);
const HOVER_SENSITIVITY = new Vector2(0.02, 0.02);

/**
 * DragControls allows for a click-and-drag control
 * of the camera
 *
 * @param props
 * @constructor
 */
export function DragControls() {
  const originEuler = useRef<Euler>(new Euler(0, 0, 0, "YXZ"));
  const setEuler = useRef<Euler>(new Euler(0, 0, 0, "YXZ"));
  const mouseDownPos = useRef<Vector2>(new Vector2(0, 0));
  const dragging = useRef(false);
  const camera = useThree((state) => state.camera);
  const { containerRef } = useEnvironment();
  const [xyz, setXYZ] = useState([0, 0, 0]);

  const { x, y, z } = useSpring({
    x: xyz[0],
    y: xyz[1],
    z: xyz[2],
    config: { ...config.default, precision: 0.0001 },
  });

  useFrame(() => {
    if (setEuler.current) {
      setEuler.current.set(x.get(), y.get(), z.get());
      camera.quaternion.setFromEuler(setEuler.current);
    }
  });

  const getNewEuler = (
    dragX: number,
    dragY: number,
    isHover?: boolean
  ): Euler => {
    const newEuler = originEuler.current.clone();
    const moveX = dragX - mouseDownPos.current.x;
    const moveY = dragY - mouseDownPos.current.y;

    const SENSITIVITY = isHover ? HOVER_SENSITIVITY : DRAG_SENSITIVITY;

    newEuler.setFromQuaternion(camera.quaternion);
    newEuler.y = originEuler.current.y - (moveX * SENSITIVITY.x) / 100;
    newEuler.x = originEuler.current.x - (moveY * SENSITIVITY.y) / 100;
    // newEuler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newEuler.x));

    return newEuler;
  };

  // touch move scripts
  const onMouseDown = (ev: MouseEvent) => {
    dragging.current = true;
    mouseDownPos.current.set(ev.clientX, ev.clientY);
    containerRef?.current?.classList.add("grabbing");
  };
  const onMouseMove = (ev: MouseEvent) => {
    const newEuler = getNewEuler(ev.clientX, ev.clientY, !dragging.current);
    setXYZ(newEuler.toArray());
  };
  const onMouseUp = (ev: MouseEvent) => {
    dragging.current = false;
    originEuler.current = getNewEuler(ev.clientX, ev.clientY);
    mouseDownPos.current.set(ev.clientX, ev.clientY);
    containerRef?.current?.classList.remove("grabbing");
  };

  useEffect(() => {
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [containerRef]);

  return null;
}
