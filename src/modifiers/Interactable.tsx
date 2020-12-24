import { ReactNode, useEffect, useRef, useState } from "react";
import { Group } from "three";
import { useEnvironment } from "../core/utils/hooks";
import { useFrame, useThree } from "react-three-fiber";

type InteractableProps = {
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
export const Interactable = (props: InteractableProps) => {
  const { children, onClick, onHover, onUnHover } = props;

  const { raycaster: defaultRaycaster } = useThree();
  const { containerRef, player, paused } = useEnvironment();

  const group = useRef<Group>();
  const [hovered, setHovered] = useState<boolean>(false);
  const [moved, setMoved] = useState<boolean>(false);
  const [cursorState, setCursorState] = useState<"down" | "up">("up");

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

  useEffect(() => {
    const mouseDown = () => {
      setCursorState("up");
      setMoved(false);
    };
    const mouseMove = () => {
      cursorState === "down" && setMoved(true);
    };
    const mouseUp = () => {
      if (onClick && hovered && !moved && !paused) {
        onClick();
      }
      setCursorState("up");
    };

    containerRef?.current?.addEventListener("mousedown", mouseDown);
    containerRef?.current?.addEventListener("touchstart", mouseDown);
    containerRef?.current?.addEventListener("mousemove", mouseMove);
    containerRef?.current?.addEventListener("touchmove", mouseMove);
    containerRef?.current?.addEventListener("mouseup", mouseUp);
    containerRef?.current?.addEventListener("touchend", mouseUp);
    return () => {
      containerRef?.current?.removeEventListener("mousedown", mouseDown);
      containerRef?.current?.removeEventListener("touchstart", mouseDown);
      containerRef?.current?.removeEventListener("mouseup", mouseUp);
      containerRef?.current?.removeEventListener("touchend", mouseUp);
      containerRef?.current?.removeEventListener("mousemove", mouseMove);
      containerRef?.current?.removeEventListener("touchmove", mouseMove);
    };
  }, [containerRef, hovered, onClick, player, moved]);

  return <group ref={group}>{children}</group>;
};
