import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Group, Vector2 } from "three";
import { useEnvironment } from "../core/contexts/environment";
import { useFrame, useThree } from "react-three-fiber";
import { isMobile } from "react-device-detect";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  onHover?: () => void;
  onUnHover?: () => void;
};

/**
 *
 * Interactable adds on click and hover methods to any group of Object3D's
 *
 * @param props
 * @constructor
 */
export const Interactable = (props: Props) => {
  const { children, onClick, onHover, onUnHover } = props;

  const { raycaster: defaultRaycaster, gl } = useThree();
  const { domElement } = gl;
  const { player } = useEnvironment();

  const group = useRef<Group>();
  const [hovered, setHovered] = useState(false);
  const downPos = useMemo(() => new Vector2(), []);
  const clickQueued = useRef(false);

  // continuously update the hover state
  useFrame(() => {
    if (group.current) {
      const raycaster = (player && player.raycaster) || defaultRaycaster;
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
      if (onClick && dist < 5 && hovered && !clickQueued.current) {
        clickQueued.current = true;
        setTimeout(() => {
          if (clickQueued.current) {
            onClick();
            clickQueued.current = false;
          }
        }, 200);
      }
    },
    [downPos, hovered]
  );

  // cancel queued click if there's a double click
  // (desktop only)
  const onDoubleClick = () => {
    clickQueued.current = false;
  };

  useEffect(() => {
    if (isMobile) {
      domElement.addEventListener("touchstart", onTouchStart);
      domElement.addEventListener("touchend", onTouchEnd);
    } else {
      domElement.addEventListener("mousedown", onMouseDown);
      domElement.addEventListener("mouseup", onMouseUp);
      domElement.addEventListener("dblclick", onDoubleClick);
    }

    return () => {
      if (isMobile) {
        domElement.removeEventListener("touchstart", onTouchStart);
        domElement.removeEventListener("touchend", onTouchEnd);
      } else {
        domElement.removeEventListener("mousedown", onMouseDown);
        domElement.removeEventListener("mouseup", onMouseUp);
        domElement.removeEventListener("dblclick", onDoubleClick);
      }
    };
  }, [onMouseUp, onTouchEnd]);

  return <group ref={group}>{children}</group>;
};
