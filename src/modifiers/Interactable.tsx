import { ReactNode, useEffect, useRef, useState } from "react";
import { Group } from "three";
import { useEnvironment } from "../core/";
import { useFrame } from "react-three-fiber";

type InteractableProps = {
  children: ReactNode;
  onClick?: () => void;
  onHover?: () => void;
  onUnHover?: () => void;
};

/**
 *
 * Interactible adds on click and hover methods to any group of Object3D's
 *
 * @param props
 * @constructor
 */
export const Interactable = (props: InteractableProps) => {
  const { children, onClick, onHover, onUnHover } = props;

  const { player } = useEnvironment();
  const { raycaster } = player;

  const group = useRef<Group>();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (group.current && raycaster) {
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
    const checkClick = () => {
      if (hovered && onClick) {
        onClick();
      }
    };

    document.addEventListener("click", checkClick);
    return () => {
      document.removeEventListener("click", checkClick);
    };
  }, [hovered, onClick]);

  return <group ref={group}>{children}</group>;
};
