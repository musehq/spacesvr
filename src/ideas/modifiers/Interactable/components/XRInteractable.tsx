import { Interactive } from "@react-three/xr";
import { InteractableProps } from "../index";

export default function XRInteractable(props: InteractableProps) {
  const { onClick, onHover, onUnHover, children } = props;

  return (
    <group name="spacesvr-interactable">
      <Interactive onHover={onHover} onBlur={onUnHover} onSelect={onClick}>
        {children}
      </Interactive>
    </group>
  );
}
