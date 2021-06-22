import { Dispatch, SetStateAction, useRef, useState } from "react";
import { GroupProps, useFrame, useThree } from "@react-three/fiber";
import { animated, useSpring } from "react-spring/three";
import { Interactable } from "../../../modifiers";
import { useLimiter } from "../../../services";
import { ControlType } from "../types/types";
import { useActions } from "../utilities/ActionHandler";
import { useEditor } from "../../EditMode";
import { Matrix4, Quaternion, Vector3 } from "three";

type MoveProps = {
  setActive: Dispatch<SetStateAction<ControlType>>;
  active: string | null;
} & GroupProps;

export function Rotate(props: MoveProps) {
  const { active, setActive, ...restProps } = props;
  const [hover, setHover] = useState<boolean>(false);
  const actionRecorded = useRef<boolean>(false);
  const { camera } = useThree();
  const objectRot = useRef<Vector3>(new Vector3());
  const initRot = useRef<Vector3 | null>(new Vector3());
  const cameraRot = useRef(new Vector3());
  const { editObject, editor, mouseDown, intersection } = useEditor();
  const actions = useActions();
  const vecLength = 5;
  console.log(actions);

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
      mouseDown === editObject.name &&
      editObject.name !== "Editor" &&
      intersection &&
      editor &&
      // @ts-ignore
      editor.scale.x > 15
    ) {
      if (!actionRecorded.current) {
        const matrix = new Matrix4();
        const quaternion = new Quaternion().setFromEuler(editObject.rotation);
        actions.add({
          target: editObject,
          matrix: matrix.compose(
            editObject.position,
            quaternion,
            editObject.scale
          ),
        });
        actionRecorded.current = true;
        // objectRot.current = new Vector3(editObject.rotation.x, editObject.rotation.y, editObject.rotation.z);
        // objectRot.current.negate();
        // objectRot.current = new Vector3(editObject.rotation.x, editObject.rotation.y, editObject.rotation.z).normalize().setLength(vecLength);
        //
        // initRot.current = intersection.normalize().setLength(vecLength);
      }

      // initRot.current.rotation.
      const dragVector = new Vector3();
      // cameraRot.current = new Vector3(camera.rotation.x, camera.rotation.y, camera.rotation.z);
      // cameraRot.current.negate();
      // const newRot = objectRot.current.add(cameraRot.current);
      editObject.rotation.set(
        cameraRot.current.x,
        cameraRot.current.y,
        cameraRot.current.z
      );
      // editObject.rotation.set(newRot.x, newRot.y, newRot.z);
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
