import { ColorRepresentation, Mesh } from "three";
import { Interactable, InteractableProps } from "../modifiers/Interactable";
import { MeshProps } from "@react-three/fiber";
import { forwardRef } from "react";

type HitBox = {
  args: [number, number, number];
  visible?: boolean;
  color?: ColorRepresentation;
} & Omit<InteractableProps, "children"> &
  Omit<MeshProps, "args">;

export const HitBox = forwardRef<Mesh, HitBox>((props: HitBox, ref) => {
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
      <mesh visible={visible} name="spacesvr-hitbox" ref={ref} {...rest}>
        <boxBufferGeometry args={args} />
        {visible && (
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        )}
      </mesh>
    </Interactable>
  );
});
