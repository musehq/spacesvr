import { useRef, useEffect, MutableRefObject } from "react";
import { Vector3 } from "three";

type KeyboardMovementProps = {
  direction: MutableRefObject<Vector3>;
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
  const { direction } = props;

  const pressedKeys = useRef([false, false, false, false]);

  // key events
  const calcDirection = () => {
    const press = pressedKeys.current; // [w, a, s, d]
    const yAxis = -1 * Number(press[0]) + Number(press[2]);
    const xAxis = -1 * Number(press[1]) + Number(press[3]);
    return new Vector3(xAxis, yAxis, 0);
  };

  const onKeyDown = (ev: KeyboardEvent) => {
    if (ev.key === "w" || ev.key === "W" || ev.key === "ArrowUp") {
      pressedKeys.current[0] = true;
    }
    if (ev.key === "a" || ev.key === "A" || ev.key === "ArrowLeft") {
      pressedKeys.current[1] = true;
    }
    if (ev.key === "s" || ev.key === "S" || ev.key === "ArrowDown") {
      pressedKeys.current[2] = true;
    }
    if (ev.key === "d" || ev.key === "D" || ev.key === "ArrowRight") {
      pressedKeys.current[3] = true;
    }
    direction.current = calcDirection();
  };
  const onKeyUp = (ev: KeyboardEvent) => {
    if (ev.key === "w" || ev.key === "W" || ev.key === "ArrowUp") {
      pressedKeys.current[0] = false;
    }
    if (ev.key === "a" || ev.key === "A" || ev.key === "ArrowLeft") {
      pressedKeys.current[1] = false;
    }
    if (ev.key === "s" || ev.key === "S" || ev.key === "ArrowDown") {
      pressedKeys.current[2] = false;
    }
    if (ev.key === "d" || ev.key === "D" || ev.key === "ArrowRight") {
      pressedKeys.current[3] = false;
    }

    direction.current = calcDirection();
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [onKeyUp, onKeyDown]);

  return <></>;
};

export default KeyboardMovement;
