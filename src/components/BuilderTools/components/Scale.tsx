import { Dispatch, SetStateAction, useRef, useState } from "react";
import { GroupProps, useFrame, useThree } from "@react-three/fiber";
import { animated, useSpring } from "react-spring/three";
import { Interactable } from "../../../modifiers";
import { Object3D, Vector2, Vector3 } from "three";
import { useLimiter } from "../../../services";
import { ControlType } from "../types/types";
import { useActions } from "../utilities/ActionHandler";
import { useEditor } from "../../EditMode";
import { useEnvironment } from "../../../core/contexts";

type MoveProps = {
  setActive: Dispatch<SetStateAction<ControlType>>;
  active: string | null;
} & GroupProps;

function getDist(p1: Vector2, p2: Vector2): number {
  return Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2));
}

export function Scale(props: MoveProps) {
  const { active, setActive, ...restProps } = props;
  const [hover, setHover] = useState<boolean>(false);
  const actionRecorded = useRef<boolean>(false);
  const contactPoint = useRef<Vector3>(new Vector3());
  const editDist = useRef<number>(0);
  const { editObject, editor, mouseDown, intersection } = useEditor();
  const {
    gl: { domElement },
    camera,
  } = useThree();
  const actions = useActions();

  const { color } = useSpring({
    color: hover
      ? "rgba(150, 150, 150, 1)"
      : active === "scale"
      ? "rgba(0, 150, 0, 1)"
      : "rgba(0, 0, 0, 1)",
    config: {
      mass: 1,
    },
  });

  function getScreenXY(position: Vector3): Vector3 {
    position.project(camera);
    position.x = Math.round(
      (0.5 + position.x / 2) * (domElement.width / window.devicePixelRatio)
    );
    position.y = Math.round(
      (0.5 - position.y / 2) * (domElement.width / window.devicePixelRatio)
    );
    position.z = 0;
    return position;
  }

  const limiter = useLimiter(45);
  useFrame(({ clock }, delta) => {
    if (!limiter.isReady(clock) || active !== "scale" || !editObject) return;
    // console.log(mouseDown)

    if (
      mouseDown !== "" &&
      editObject.name !== "Editor" &&
      editor &&
      // @ts-ignore
      editor.scale.x > 15
    ) {
      if (!actionRecorded.current) {
        actions.add({
          target: editObject,
          attribute: "scale",
          value: editObject.scale,
        });
        actionRecorded.current = true;
        // contactPoint.current = intersection as Vector3;
        // @ts-ignore
        // contactPoint.current = getScreenXY(intersection);
        contactPoint.current = new Vector3(
          editObject.position.x,
          editObject.position.y,
          editObject.position.z
        );
        // editDist.current = editObject.position.unproject(camera).lengthSq()
        // console.log(editObject.position);
        // console.log("initial rot");
        // console.log(camera.rotation);
      }
      contactPoint.current.unproject(camera).normalize();
      const rotation = new Vector3(0, 0, 1);
      // const cross = contactPoint.current.cross(new Vector3(camera.rotation.x, camera.rotation.y, camera.rotation.z)).length();
      const angle = contactPoint.current.angleTo(rotation);
      console.log(contactPoint.current.distanceTo(rotation.unproject(camera)));
      // console.log(contactPoint.current);

      // console.log(cross);

      // editObject.scale.set(contactPoint.current.x + distance, contactPoint.current.y + distance, contactPoint.current.z + distance);
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
          if (active !== "scale") {
            setHover(true);
          }
        }}
        onUnHover={() => {
          if (hover === true) {
            setHover(false);
          }
        }}
        onClick={() => {
          if (active !== "scale") {
            setActive("scale");
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
