import { Interactive } from "@react-three/xr";
import { InteractableProps } from "../index";

export default function XRInteractable(props: InteractableProps) {
  const { onClick, onHover, onUnHover, children } = props;

  return (
    <group name="spacesvr-interactable">
      <Interactive
        onHover={onHover}
        onBlur={onUnHover}
        onSelect={onClick ? (e) => onClick(e.intersection!) : undefined}
      >
        {children}
      </Interactive>
    </group>
  );
}
