import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Group, Vector2 } from "three";
import { useEnvironment } from "../core/utils/hooks";
import { useFrame, useThree } from "react-three-fiber";
import { isMobile } from "react-device-detect";

type Props = {
  onClick?: () => void;
  onHover?: () => void;
  onUnHover?: () => void;
  children: ReactNode;
};

/**
 *
 * Interactable adds on click and hover methods to any group of Object3D's.
 *
 * This is a bit convoluted for the sake of working with the ClickDragControls
 * (i.e. the test for a double click)
 *
 * @param props
 * @constructor
 */
export const Interactable = (props: Props) => {
  const { onClick, onHover, onUnHover, children } = props;

  const { gl } = useThree();
  const { domElement } = gl;
  const { player } = useEnvironment();

  const group = useRef<Group>();
  const [hovered, setHovered] = useState(false);
  const { current: downPos } = useRef(new Vector2());

  // continuously update the hover state
  useFrame(() => {
    if (group.current && player && player.raycaster) {
      const { raycaster } = player;
      const intersections = raycaster.intersectObject(group.current, true);
      if (intersections && intersections.length > 0) {
        if (!hovered) {
          setHovered(true);
          if (onHover) {
            onHover();
          }
        }
      } else if (hovered) {
        setHovered(false);
        if (onUnHover) {
          onUnHover();
        }
      }
    }
  });

  // start touch
  const onTouchStart = (e: TouchEvent) => {
    downPos.set(e.touches[0].clientX, e.touches[0].clientY);
  };

  // if little to no movement on touch end, call click event
  const onTouchEnd = (e: TouchEvent) => {
    const dist = downPos.distanceTo(
      new Vector2(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
    );
    if (onClick && dist < 5 && hovered) {
      onClick();
    }
  };

  // set mouse down position
  const onMouseDown = (e: MouseEvent) => {
    downPos.set(e.clientX, e.clientY);
  };

  // if little to no movement on mouse up, queue a click event
  const onMouseUp = useCallback(
    (e: MouseEvent) => {
      const dist = downPos.distanceTo(new Vector2(e.clientX, e.clientY));
      if (onClick && dist < 5 && hovered) {
        onClick();
      }
    },
    [downPos, hovered]
  );

  useEffect(() => {
    if (isMobile) {
      domElement.addEventListener("touchstart", onTouchStart);
      domElement.addEventListener("touchend", onTouchEnd);
    } else {
      domElement.addEventListener("mousedown", onMouseDown);
      domElement.addEventListener("mouseup", onMouseUp);
    }

    return () => {
      if (isMobile) {
        domElement.removeEventListener("touchstart", onTouchStart);
        domElement.removeEventListener("touchend", onTouchEnd);
      } else {
        domElement.removeEventListener("mousedown", onMouseDown);
        domElement.removeEventListener("mouseup", onMouseUp);
      }
    };
  }, [onMouseUp, onTouchEnd]);

  return <group ref={group}>{children}</group>;
};
