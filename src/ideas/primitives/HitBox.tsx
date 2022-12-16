import { ColorRepresentation } from "three";
import { Interactable, InteractableProps } from "../modifiers/Interactable";
import { MeshProps } from "@react-three/fiber";

type HitBox = {
  args: [number, number, number];
  visible?: boolean;
  color?: ColorRepresentation;
} & Omit<InteractableProps, "children"> &
  Omit<MeshProps, "args">;

export function HitBox(props: HitBox) {
  const {
    args,
    visible = false,
    color = "red",
    onClick,
    onHover,
    onUnHover,
    raycaster,
    ...rest
  } = props;

  return (
    <Interactable
      onClick={onClick}
      onHover={onHover}
      onUnHover={onUnHover}
      raycaster={raycaster}
    >
      <mesh visible={visible} name="spacesvr-hitbox" {...rest}>
        <boxBufferGeometry args={args} />
        {visible && (
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        )}
      </mesh>
    </Interactable>
  );
}
