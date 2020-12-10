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

const MOUSEDOWN_TIMEOUT = 500; // ms

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
  const { containerRef, player } = useEnvironment();

  const group = useRef<Group>();
  const [hovered, setHovered] = useState(false);
  const [allowClick, setAllowClick] = useState(false);

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
      setAllowClick(true);
      setTimeout(() => setAllowClick(false), MOUSEDOWN_TIMEOUT);
    };

    const mouseUp = () => {
      if (onClick && hovered && allowClick) {
        onClick();
      }
    };

    containerRef?.current?.addEventListener("mousedown", mouseDown);
    containerRef?.current?.addEventListener("touchstart", mouseDown);
    containerRef?.current?.addEventListener("mouseup", mouseUp);
    containerRef?.current?.addEventListener("touchend", mouseUp);
    return () => {
      containerRef?.current?.removeEventListener("mousedown", mouseDown);
      containerRef?.current?.removeEventListener("touchstart", mouseDown);
      containerRef?.current?.removeEventListener("mouseup", mouseUp);
      containerRef?.current?.removeEventListener("touchend", mouseUp);
    };
  }, [containerRef, hovered, onClick, player, allowClick]);

  return <group ref={group}>{children}</group>;
};
