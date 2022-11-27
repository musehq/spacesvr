import { Clock, Raycaster, Vector2 } from "three";
// @ts-ignore
import { getCaretAtPoint } from "troika-three-text";
import { MutableRefObject } from "react";

/**
 * Given an input, handle logic for shift clicking to select text
 * @param input
 * @param newIndex
 */

export const handleShiftSelect = (
  input: HTMLInputElement,
  newIndex: number
) => {
  const HAS_SELECTION = input.selectionStart !== input.selectionEnd;

  if (!HAS_SELECTION) {
    if (newIndex < (input.selectionStart || 0)) {
      input.setSelectionRange(newIndex, input.selectionStart || 0, "backward");
    } else {
      input.setSelectionRange(input.selectionStart || 0, newIndex, "forward");
    }
    return;
  }

  // shift clicking to select text
  const isForward = input.selectionDirection === "forward";
  const start = input.selectionStart || 0;
  const end = input.selectionEnd || 0;
  if (isForward) {
    if (start === newIndex) {
      input.setSelectionRange(start, newIndex, "none");
    } else if (newIndex > start) {
      input.setSelectionRange(start, newIndex, "forward");
    } else {
      input.setSelectionRange(newIndex, start, "backward");
    }
  } else {
    if (end === newIndex) {
      input.setSelectionRange(newIndex, end, "none");
    } else if (newIndex < end) {
      input.setSelectionRange(newIndex, end, "backward");
    } else {
      input.setSelectionRange(end, newIndex, "forward");
    }
  }
};

const dummy = new Vector2();
type Caret = { x: number; y: number; height: number; charIndex: number };

/**
 * Return the caret position of the last click
 * @param text
 * @param raycaster
 */
export const getClickedCaret = (
  text: any,
  raycaster: Raycaster
): Caret | null => {
  const intersections = raycaster.intersectObject(text, true);
  if (intersections.length === 0) return null;
  const inter = intersections[0];
  const textPos = text.worldPositionToTextCoords(inter.point, dummy);
  return getCaretAtPoint(text.textRenderInfo, textPos.x, textPos.y) as Caret;
};

const CLICK_TIMEOUT = 0.2; // seconds

/**
 * Calling this indicates a click. Return whether it was a single, double, or triple click
 * @param clock
 * @param lastClickTime
 * @param lastDoubleClickTime
 */
export const getClickType = (
  clock: Clock,
  lastClickTime: MutableRefObject<number>,
  lastDoubleClickTime: MutableRefObject<number>
): 1 | 2 | 3 => {
  const time = clock.elapsedTime;
  const clickTime = time - lastClickTime.current;
  const doubleClickTime = time - lastDoubleClickTime.current;

  if (clickTime < CLICK_TIMEOUT) {
    if (doubleClickTime < CLICK_TIMEOUT * 2) {
      lastDoubleClickTime.current = time;
      return 3;
    } else {
      lastClickTime.current = time;
      lastDoubleClickTime.current = time;
      return 2;
    }
  } else {
    lastClickTime.current = time;
    return 1;
  }
};

/**
 * Return the start and end indexes of the word that the caret is in
 * @param text
 * @param caret
 */
export const getWordBoundsAtCaret = (text: string, caret: number) => {
  let left = caret;
  let right = caret;

  while (left > 0 && text[left - 1] !== " ") {
    left--;
  }
  while (right < text.length && text[right] !== " ") {
    right++;
  }

  return [left, right];
};
