import { useRef, useEffect, MutableRefObject, useCallback } from "react";
import { Vector3 } from "three";
import { useEnvironment } from "../../../Environment";

type KeyboardMovementProps = {
  direction: MutableRefObject<Vector3>;
  flying: boolean;
};

/**
 * KeyboardMovement gives the player a direction to move by taking
 * input from any source (currently keyboard) and calculating
 * relative direction.
 *
 * Direction is stored as a Vector3 with the following format
 *    x: left/right movement, + for right
 *    y: forward/back movement, + for forwards
 *    z: up/down movement, + for up
 *
 * @param props
 * @constructor
 */
const KeyboardMovement = (props: KeyboardMovementProps) => {
  const { direction, flying } = props;

  const { paused } = useEnvironment();

  const pressedKeys = useRef([false, false, false, false, false]);

  // key events
  const calcDirection = useCallback(() => {
    const press = pressedKeys.current; // [w, a, s, d]
    const yAxis = -1 * Number(press[0]) + Number(press[2]);
    const xAxis = -1 * Number(press[1]) + Number(press[3]);
    return [xAxis, flying && press[4] ? 1 : 0, yAxis];
  }, [flying]);

  const updatePressedKeys = useCallback(
    (ev: KeyboardEvent, pressedState: boolean) => {
      // We try to use `code` first because that's the layout-independent property.
      // Then we use `key` because some browsers, notably Internet Explorer and
      // Edge, support it but not `code`. Then we use `keyCode` to support older
      // browsers like Safari, older Internet Explorer and older Chrome.
      switch (ev.code || ev.key || ev.keyCode) {
        case "KeyW":
        case "KeyI":
        case "ArrowUp":
        case "Numpad8":
        case 38: // keyCode for arrow up
          pressedKeys.current[0] = pressedState;
          break;
        case "KeyA":
        case "KeyJ":
        case "ArrowLeft":
        case "Numpad4":
        case 37: // keyCode for arrow left
          pressedKeys.current[1] = pressedState;
          break;
        case "KeyS":
        case "KeyK":
        case "ArrowDown":
        case "Numpad5":
        case "Numpad2":
        case 40: // keyCode for arrow down
          pressedKeys.current[2] = pressedState;
          break;
        case "KeyD":
        case "KeyL":
        case "ArrowRight":
        case "Numpad6":
        case 39: // keyCode for arrow right
          pressedKeys.current[3] = pressedState;
          break;
        case "Space":
          pressedKeys.current[4] = pressedState;
          break;
        default:
          return;
      }
    },
    []
  );

  const onKeyDown = useCallback(
    (ev: KeyboardEvent) => {
      if (ev.defaultPrevented) {
        return;
      }

      // We don't want to mess with the browser's shortcuts
      if (ev.ctrlKey || ev.altKey || ev.metaKey) {
        return;
      }

      updatePressedKeys(ev, true);

      const [x, y, z] = calcDirection();
      direction.current.set(x, y, z);
    },
    [calcDirection, direction, updatePressedKeys]
  );

  const onKeyUp = useCallback(
    (ev: KeyboardEvent) => {
      updatePressedKeys(ev, false);

      const [x, y, z] = calcDirection();
      direction.current.set(x, y, z);
    },
    [calcDirection, direction, updatePressedKeys]
  );

  useEffect(() => {
    if (paused) {
      direction.current.set(0, 0, 0);
      pressedKeys.current = [false, false, false, false, false];
      return;
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [paused, onKeyDown, onKeyUp, direction]);

  return null;
};

export default KeyboardMovement;
