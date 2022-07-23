import { ReactNode } from "react";
import { useEnvironment } from "../../../layers/Environment";
import XRInteractable from "./components/XRInteractable";
import MobileDesktopInteractable from "./components/MobileDesktopInteractable";

export type InteractableProps = {
  onClick?: () => void;
  onHover?: () => void;
  onUnHover?: () => void;
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
