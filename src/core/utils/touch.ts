import { Vector2 } from "three";

export type Touch = {
  pos: Vector2;
  id: number;
};

export const DefaultTouch = {
  pos: new Vector2(0, 0),
  id: -1,
};

// get the current touch from touch array
export const getCurrentTouch = (curTouchId: number, touches: TouchList) => {
  const len = touches.length;
  for (let i = 0; i < len; i++) {
    if (curTouchId === touches[i].identifier) {
      return touches[i];
    }
  }
  return undefined;
};

// check whether given touch tapped nipple
export const tappedNipple = (ev: TouchEvent) => {
  // get the relevant touched element (casted as an Element)
  const ele = ev.touches[ev.touches.length - 1].target as Element;
  return (
    ele.classList.contains("nipple-container") ||
    ele.classList.contains("front") ||
    ele.classList.contains("back")
  );
};
