import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { GroupProps, useFrame, useThree } from "@react-three/fiber";
import { animated, useSpring } from "react-spring/three";
import { Interactable } from "../../../modifiers";
import { Matrix4, Quaternion, Vector3 } from "three";
import { useLimiter } from "../../../services";
import { ControlType } from "../types/types";
import { useActions } from "../utilities/ActionHandler";
import { useEditor } from "../../EditMode";

type MoveProps = {
  setActive: Dispatch<SetStateAction<ControlType>>;
  active: string | null;
} & GroupProps;

export function Move(props: MoveProps) {
  const { active, setActive, ...restProps } = props;
  const [hover, setHover] = useState<boolean>(false);
  const { camera } = useThree();
  const objectPos = useRef(new Vector3());
  const actionRecorded = useRef<boolean>(false);
  const { editObject, editor, mouseDown } = useEditor();
  const actions = useActions();

  const { color } = useSpring({
    color:
      active === "position"
        ? "rgba(0, 150, 0, 1)"
        : hover
        ? "rgba(150, 150, 150, 1)"
        : "rgba(0, 0, 0, 1)",
    config: {
      mass: 1,
    },
  });

  const { current: dummyVector } = useRef(new Vector3());
  const DISTANCE = 5,
    distance = DISTANCE * 0.5;

  const xPos = (0 * 0.00008 * 1) / 2;
  const yPos = 0.04 * 0;

  const limiter = useLimiter(45);
  useFrame(({ clock }, delta) => {
    if (!limiter.isReady(clock) || active !== "position" || !editObject) return;

    if (
      mouseDown === editObject.name &&
      editObject.name !== "Editor" &&
      editor &&
      // @ts-ignore
      editor.scale.x > 15
    ) {
      if (!actionRecorded.current) {
        const matrix = new Matrix4();
        const quaternion = new Quaternion().setFromEuler(editObject.rotation);
        actions.add({
          target: editObject,
          matrix: editObject.matrixWorld,
        });
        actionRecorded.current = true;
      }

      console.log(actions);
      dummyVector.set(xPos * DISTANCE, yPos * DISTANCE, -distance);
      const moveQuaternion = camera.quaternion.clone();
      dummyVector.applyQuaternion(moveQuaternion);

      editObject.getWorldPosition(objectPos.current);
      const deltaPos = objectPos.current.sub(camera.position);
      editObject.position.sub(deltaPos);
      editObject.position.add(dummyVector);
    } else {
      if (actionRecorded.current) {
        actionRecorded.current = false;
      }
    }
  });

  console.log(actions);
  return (
    <group position-z={0.05} {...restProps}>
      <mesh>
        <boxBufferGeometry args={[0.17, 0.17, 0.05]} />
        <animated.meshBasicMaterial color={color} />
      </mesh>
      <Interactable
        onHover={() => {
          if (active !== "position") {
            setHover(true);
          }
        }}
        onUnHover={() => {
          if (hover === true) {
            setHover(false);
          }
        }}
        onClick={() => {
          if (active !== "position") {
            setActive("position");
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
