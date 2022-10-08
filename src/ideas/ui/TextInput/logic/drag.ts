import { MutableRefObject, useEffect, useRef } from "react";
import { getClickedCaret, handleShiftSelect } from "./select";
import { useThree } from "@react-three/fiber";
import { useEnvironment } from "../../../../layers/Environment";
import { Raycaster } from "three";

export const useDragSelect = (
  input: HTMLInputElement,
  text: MutableRefObject<any>,
  raycaster: Raycaster,
  focusInput: () => void
) => {
  const gl = useThree((state) => state.gl);
  const mouse = useThree((state) => state.mouse);
  const camera = useThree((state) => state.camera);
  const { device } = useEnvironment();

  const startCar = useRef(0);
  const dragging = useRef(false);

  useEffect(() => {
    const _text = text.current;
    if (!_text || !_text.textRenderInfo) return;

    const handleMove = () => {
      const car = getClickedCaret(_text, raycaster);
      if (car == null) return;
      if (!dragging.current) {
        // consider it a drag when mouse moves by at least 1 character
        if (car.charIndex === startCar.current) return;
        dragging.current = true;
        input.setSelectionRange(startCar.current, startCar.current);
      }
      handleShiftSelect(input, car.charIndex);
    };

    const touchMove = (e: TouchEvent) => {
      // because we stop propagation, we need to manually set the mouse position
      mouse.x = (e.touches[0].clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.y = -(e.touches[0].clientY / gl.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      handleMove();
    };

    const dragEnd = () => {
      if (device.mobile) {
        gl.domElement.removeEventListener("touchmove", touchMove);
        gl.domElement.removeEventListener("touchend", dragEnd);
      } else {
        gl.domElement.removeEventListener("mousemove", handleMove);
        gl.domElement.removeEventListener("mouseup", dragEnd);
      }
    };

    const dragStart = (e: Event) => {
      dragging.current = false;
      const car = getClickedCaret(_text, raycaster);
      if (car === null) return;
      focusInput();
      e.stopPropagation(); // stop touch controls from running so screen doesn't move while dragging
      startCar.current = car.charIndex;
      if (device.mobile) {
        gl.domElement.addEventListener("touchmove", touchMove);
        gl.domElement.addEventListener("touchend", dragEnd);
      } else {
        gl.domElement.addEventListener("mousemove", handleMove);
        gl.domElement.addEventListener("mouseup", dragEnd);
      }
    };

    if (device.mobile) {
      gl.domElement.addEventListener("touchstart", dragStart);
      return () => gl.domElement.removeEventListener("touchstart", dragStart);
    } else {
      gl.domElement.addEventListener("mousedown", dragStart);
      return () => gl.domElement.removeEventListener("mousedown", dragStart);
    }
  }, [
    gl.domElement,
    focusInput,
    input,
    text,
    device.mobile,
    mouse,
    camera,
    raycaster,
  ]);
};
