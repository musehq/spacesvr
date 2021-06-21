import { Dispatch, SetStateAction, useRef, useState } from "react";
import { GroupProps, useFrame } from "@react-three/fiber";
import { animated, useSpring } from "react-spring/three";
import { Interactable } from "../../../modifiers";
import { useLimiter } from "../../../services";
import { ControlType } from "../types/types";
import { useActions } from "../utilities/ActionHandler";
import { useEditor } from "../../EditMode";
import { Vector3 } from "three";

type MoveProps = {
  setActive: Dispatch<SetStateAction<ControlType>>;
  active: string | null;
} & GroupProps;

export function Rotate(props: MoveProps) {
  const { active, setActive, ...restProps } = props;
  const [hover, setHover] = useState<boolean>(false);
  const actionRecorded = useRef<boolean>(false);
  const objectRot = useRef(new Vector3());
  const { editObject, editor, mouseDown } = useEditor();
  const actions = useActions();
  // console.log(actions);

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
    if (!limiter.isReady(clock) || active !== "rotation" || !editObject) return;

    if (
      mouseDown &&
      editObject.name !== "Editor" &&
      editor &&
      // @ts-ignore
      editor.scale.x > 15
    ) {
      if (!actionRecorded.current) {
        actions.add({
          target: editObject,
          attribute: "rotation",
          value: editObject.rotation,
        });
        actionRecorded.current = true;
      }
    } else {
      if (actionRecorded.current) {
        actionRecorded.current = false;
      }
    }
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
          } else {
            setActive(null);
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
