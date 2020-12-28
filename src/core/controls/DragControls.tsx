import { useRef, useEffect } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { config, useSpring } from "react-spring";
import { Vector2, Euler, MathUtils } from "three";
import { getSpringValues } from "../utils/spring";

const DRAG_SENSITIVITY = new Vector2(0.25, 0.25); //new Vector2(0.16, 0.16);
const HOVER_SENSITIVITY = new Vector2(0.02, 0.02);

/**
 * DragControls allows for a click-and-drag control
 * of the camera
 */
const DragControls = () => {
  const { camera, gl, mouse } = useThree();
  const { domElement } = gl;

  // initial position (map mouse position)
  const initMouseDown: Vector2 = mouse
    ? mouse
        .clone()
        .add(new Vector2(1, 1))
        .multiply(new Vector2(window.innerWidth / 2, window.innerHeight / 2))
    : new Vector2(0, 0);
  const initEuler = new Euler(0, 0, 0, "YXZ").setFromQuaternion(
    camera.quaternion
  );

  const dummyEuler = useRef(initEuler.clone());
  const originEuler = useRef(initEuler.clone());
  const mouseDownPos = useRef(initMouseDown);
  const dragging = useRef(false);

  // used to interpolate euler
  const [spring, setSpring] = useSpring(() => ({
    xyz: initEuler.toArray(),
    config: { ...config.default, precision: 0.0001 },
  }));

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

    const xDiff = (moveY * SENSITIVITY.x) / 100;
    const xnew = originEuler.current.x - xDiff;
    newEuler.x = MathUtils.clamp(
      xnew,
      -Math.PI / 2 + 0.00001,
      Math.PI / 2 - 0.00001
    );

    // attempt to smoothly limit, work in progress
    // const xperc = Math.abs(newEuler.x / (Math.PI / 2));
    // const xscalar = 1 - Math.pow(xperc, 2);

    newEuler.y = originEuler.current.y - (moveX * SENSITIVITY.y) / 100;

    return newEuler;
  };

  // touch move scripts
  const onMouseDown = (e: MouseEvent) => {
    dragging.current = true;
    mouseDownPos.current.set(e.clientX, e.clientY);
    domElement.classList.add("grabbing");
  };
  const onMouseMove = (e: MouseEvent) => {
    console.log(e.clientX, e.clientY);
    const newEuler = getNewEuler(e.clientX, e.clientY, !dragging.current);
    setSpring({ xyz: newEuler.toArray() });
  };
  const onMouseUp = (e: MouseEvent) => {
    dragging.current = false;
    originEuler.current = getNewEuler(e.clientX, e.clientY);
    mouseDownPos.current.set(e.clientX, e.clientY);
    domElement.classList.remove("grabbing");
  };

  // update camera quaternion from euler
  useFrame(() => {
    const [x, y, z] = getSpringValues(spring);
    dummyEuler.current.set(x, y, z);
    camera.quaternion.setFromEuler(dummyEuler.current);
  });

  useEffect(() => {
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [domElement]);

  return null;
};

export default DragControls;
