import { Dispatch, SetStateAction, useState } from "react";
import { GroupProps, useFrame } from "@react-three/fiber";
import { animated, useSpring } from "react-spring/three";
import { Interactable } from "../../../modifiers";
import { Object3D } from "three";
import { useLimiter } from "../../../services";
import { ControlType } from "../types/types";
import { useActions } from "../utilities/ActionHandler";

type MoveProps = {
  object: Object3D | undefined;
  setActive: Dispatch<SetStateAction<ControlType>>;
  active: string | null;
} & GroupProps;

export function Rotate(props: MoveProps) {
  const { object, active, setActive, ...restProps } = props;
  const [hover, setHover] = useState<boolean>(false);
  const actions = useActions();

  const { color } = useSpring({
    color: hover
      ? "rgba(150, 150, 150, 1)"
      : active === "rotation"
      ? "rgba(0, 150, 0, 1)"
      : "rgba(0, 0, 0, 1)",
    config: {
      mass: 1,
    },
  });

  const limiter = useLimiter(45);
  useFrame(({ clock }, delta) => {
    if (!limiter.isReady(clock) || active !== "rotation" || !object) return;

    object.position.y += Math.sin(delta / 10);
  });

  return (
    <group position-z={0.05} {...restProps}>
      <mesh>
        <boxBufferGeometry args={[0.17, 0.17, 0.05]} />
        <animated.meshBasicMaterial color={color} />
      </mesh>
      <Interactable
        onHover={() => {
          if (active !== "rotation") {
            setHover(true);
          }
        }}
        onUnHover={() => {
          if (hover === true) {
            setHover(false);
          }
        }}
        onClick={() => {
          if (active !== "rotation") {
            setActive("rotation");
            setHover(false);
          }
        }}
      >
        <mesh position-z={0.02}>
          <boxBufferGeometry args={[0.15, 0.15, 0.05]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </Interactable>
    </group>
  );
}
