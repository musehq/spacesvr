import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { Group, Vector2 } from "three";
import { isMobile } from "react-device-detect";
import { InteractableProps } from "../index";
import { usePlayer } from "../../../../layers/Player";
import { useLimiter } from "../../../../logic/limiter";

/**
 * This is a bit convoluted for the sake of working with the ClickDragControls
 * (i.e. the test for a double click)
 */
export default function MobileDesktopInteractable(props: InteractableProps) {
  const { onClick, onHover, onUnHover, children } = props;

  const gl = useThree((state) => state.gl);
  const { domElement } = gl;
  const { raycaster } = usePlayer();

  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const { current: downPos } = useRef(new Vector2());
  const limiter = useLimiter(30);

  // continuously update the hover state
  useFrame(({ clock }) => {
    if (!group.current || !limiter.isReady(clock) || !raycaster) return;

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
  }, [onMouseUp, onTouchEnd, onClick]);

  return (
    <group name="spacesvr-interactable" ref={group}>
      {children}
    </group>
  );
}
