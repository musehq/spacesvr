import { MutableRefObject, useEffect, useRef } from "react";
import { getClickedCaret, handleShiftSelect } from "./select";
import { usePlayer } from "../../../../layers/Player";

export const useDragSelect = (
  input: HTMLInputElement,
  text: MutableRefObject<any>,
  focusInput: () => void
) => {
  const { raycaster } = usePlayer();

  const startCar = useRef(0);
  const dragging = useRef(false);

  useEffect(() => {
    const _text = text.current;
    if (!_text || !_text.textRenderInfo) return;

    const dragMove = () => {
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
    const dragEnd = () => {
      document.removeEventListener("mousemove", dragMove);
      document.removeEventListener("touchend", dragEnd);
      document.removeEventListener("mouseup", dragEnd);
    };

    const dragStart = () => {
      dragging.current = false;
      const car = getClickedCaret(_text, raycaster);
      if (car === null) return;
      focusInput();
      startCar.current = car.charIndex;
      document.addEventListener("mousemove", dragMove);
      document.addEventListener("touchend", dragEnd);
      document.addEventListener("mouseup", dragEnd);
    };

    document.addEventListener("touchstart", dragStart);
    document.addEventListener("mousedown", dragStart);

    return () => {
      document.removeEventListener("touchstart", dragStart);
      document.removeEventListener("mousedown", dragStart);
    };
  }, [focusInput, input, raycaster, text]);
};
