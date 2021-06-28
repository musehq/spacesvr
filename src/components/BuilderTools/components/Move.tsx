import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { GroupProps, useFrame, useThree } from "@react-three/fiber";
import { animated, useSpring } from "react-spring/three";
import { Interactable } from "../../../modifiers";
import { Matrix4, MeshBasicMaterial, Quaternion, Vector3 } from "three";
import { useLimiter } from "../../../services";
import { ControlType, GLTFResult } from "../types/types";
import { COLORS, FILE_URL } from "../constants/constants";
import { useActions } from "../utilities/ActionHandler";
import { useEditor } from "../../EditMode";
import { Text, useGLTF } from "@react-three/drei";

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
  const { nodes, materials } = useGLTF(FILE_URL) as GLTFResult;
  const moveMat = new MeshBasicMaterial({ color: COLORS.btnPrimary });
  const { editObject, editor, mouseDown } = useEditor();
  const actions = useActions();

  const { color, posZ } = useSpring({
    color:
      active === "position"
        ? COLORS.btnSelected
        : hover
        ? "#777777"
        : COLORS.btnSecondary,
    posZ: active === "position" ? 0.15 : 0,
    config: {
      mass: 1,
    },
  });
  // console.log(actions);

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
        const posVec = new Vector3();
        editObject.getWorldPosition(posVec);
        actions.add({
          target: editObject,
          attribute: "position",
          value: posVec,
        });
        actionRecorded.current = true;
      }

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

  return (
    <group {...restProps}>
      {/*<mesh>*/}
      {/*  <boxBufferGeometry args={[0.17, 0.17, 0.05]} />*/}
      {/*  <animated.meshBasicMaterial color={color} />*/}
      {/*</mesh>*/}
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
        <group scale={0.1} {...props} dispose={null} name="move-btn">
          <animated.group position-z={posZ}>
            <mesh
              name="move"
              geometry={nodes.move.geometry}
              material={moveMat}
            />
          </animated.group>
          <mesh name="move-click" geometry={nodes["move-click"].geometry}>
            <animated.meshBasicMaterial color={color} />
          </mesh>
          <Text
            position={[-0.75, -0.33, 0.075]}
            fontSize={0.2}
            color={COLORS.textPrimary}
            textAlign="center"
            name="move-btn-label"
          >
            Move
          </Text>
        </group>
      </Interactable>
    </group>
  );
}

useGLTF.preload(FILE_URL);
