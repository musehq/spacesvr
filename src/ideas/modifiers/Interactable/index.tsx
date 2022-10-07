import { ReactNode } from "react";
import { useEnvironment } from "../../../layers/Environment";
import XRInteractable from "./components/XRInteractable";
import MobileDesktopInteractable from "./components/MobileDesktopInteractable";
import { Intersection, Raycaster } from "three";

export type InteractableProps = {
  onClick?: (e: Intersection) => void;
  onHover?: () => void;
  onUnHover?: () => void;
  raycaster?: Raycaster;
  children: ReactNode | ReactNode[];
};

/**
 * Interactable adds on click and hover methods to any group of Object3D's.
 */
export function Interactable(props: InteractableProps) {
  const { device } = useEnvironment();

  if (device.xr) return <XRInteractable {...props} />;
  return <MobileDesktopInteractable {...props} />;
}
