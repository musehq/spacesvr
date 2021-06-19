import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GroupProps, useFrame, useThree } from "@react-three/fiber";
import { animated, useSpring } from "react-spring/three";
import { Interactable } from "../../../modifiers";
import { Object3D, Vector3 } from "three";
import { useLimiter } from "../../../services";
import { ControlType } from "../types/types";
import { useActions } from "../utilities/ActionHandler";
import { usePlayer } from "../../../core/contexts";
import { useEditor } from "../../EditMode";

type MoveProps = {
  setActive: Dispatch<SetStateAction<ControlType>>;
  active: string | null;
} & GroupProps;

export function Move(props: MoveProps) {
  const { active, setActive, ...restProps } = props;
  const [hover, setHover] = useState<boolean>(false);
  const { raycaster } = usePlayer();
  const { camera } = useThree();
  const { scene } = useThree();
  const { editObject, mouseDown, intersect } = useEditor();
  const actions = useActions();

  const { color } = useSpring({
    color: hover
      ? "rgba(150, 150, 150, 1)"
      : active === "position"
      ? "rgba(0, 150, 0, 1)"
      : "rgba(0, 0, 0, 1)",
    config: {
      mass: 1,
    },
  });

  const vec = new Vector3(),
    pos = new Vector3();

  const limiter = useLimiter(45);
  useFrame(({ clock }, delta) => {
    if (!limiter.isReady(clock) || !editObject) return;
    // if (!limiter.isReady(clock) || active !== "position" || !editObject) return;
    // console.log(intersect)

    // vec.set(
    //   ( event.clientX / window.innerWidth ) * 2 - 1,
    //   - ( event.clientY / window.innerHeight ) * 2 + 1,
    //   0.5 );
    //
    // vec.unproject( camera );
    //
    // vec.sub( camera.position ).normalize();
    //
    // const distance = - camera.position.z / vec.z;
    //
    // pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );

    if (mouseDown) {
      // MOVE OBJECT
      // @ts-ignore
      // scene.getObjectByName(editObject.name).position.set(pos.x, pos.y, pos.z);
      // console.log(scene.getObjectByName(editObject.name).position)
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
