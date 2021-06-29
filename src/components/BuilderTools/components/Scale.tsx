import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { GroupProps, useFrame, useThree } from "@react-three/fiber";
import { animated, useSpring } from "react-spring/three";
import { Interactable } from "../../../modifiers";
import {
  Matrix4,
  MeshBasicMaterial,
  Object3D,
  Quaternion,
  Vector2,
  Vector3,
} from "three";
import { useLimiter } from "../../../services";
import { ControlType, GLTFResult } from "../types/types";
import { useActions } from "../utilities/ActionHandler";
import { useEditor } from "../../EditMode";
import { useEnvironment } from "../../../core/contexts";
import { Text, useGLTF } from "@react-three/drei";
import { COLORS, FILE_URL, HOTBAR_SCALE } from "../constants/constants";

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
  const objectScale = useRef<Vector3>(new Vector3());
  const cameraRot = useRef<Vector3>(new Vector3());
  const { editObject, editor, mouseDown, intersection } = useEditor();
  const {
    gl: { domElement },
    camera,
  } = useThree();
  const actions = useActions();
  const { nodes, materials } = useGLTF(FILE_URL) as GLTFResult;
  const scaleMat = new MeshBasicMaterial({ color: COLORS.btnPrimary });

  const { color, posZ } = useSpring({
    color:
      active === "scale"
        ? COLORS.btnSelected
        : hover
        ? COLORS.btnHovered
        : COLORS.btnSecondary,
    posZ: active === "scale" ? 0.15 : 0,
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

    if (
      mouseDown === editObject.name &&
      editObject.name !== "Editor" &&
      editor &&
      // @ts-ignore
      editor.scale.x > 15
    ) {
      if (!actionRecorded.current) {
        const scaleVec = new Vector3();
        editObject.getWorldScale(scaleVec);
        actions.add({
          target: editObject,
          attribute: "scale",
          value: scaleVec,
        });
        actionRecorded.current = true;
        objectScale.current = new Vector3(
          editObject.scale.x,
          editObject.scale.y,
          editObject.scale.z
        );
        cameraRot.current = new Vector3(
          camera.rotation.x,
          camera.rotation.y,
          camera.rotation.z
        );
        contactPoint.current = new Vector3(
          editObject.position.x,
          editObject.position.y,
          editObject.position.z
        );
      }

      editObject.scale.set(
        objectScale.current.x + camera.rotation.y - cameraRot.current.y,
        objectScale.current.y + camera.rotation.y - cameraRot.current.y,
        objectScale.current.z + camera.rotation.y - cameraRot.current.y
      );
    } else {
      if (actionRecorded.current) {
        actionRecorded.current = false;
      }
    }
  });

  return (
    <group {...restProps}>
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
        <group scale={HOTBAR_SCALE} {...props} dispose={null} name="scale-btn">
          <animated.group position-z={posZ}>
            <mesh
              name="scale"
              geometry={nodes.size.geometry}
              material={scaleMat}
            />
          </animated.group>
          <mesh name="scale-click" geometry={nodes["scale-click"].geometry}>
            <animated.meshBasicMaterial color={color} />
          </mesh>
          <Text
            position={[0.65, -0.33, 0.075]}
            fontSize={0.2}
            color={COLORS.textPrimary}
            textAlign="center"
            name="scale-btn-label"
          >
            Scale
          </Text>
        </group>
      </Interactable>
    </group>
  );
}
