import { Text, useGLTF } from "@react-three/drei";
import { TextInput } from "../../TextInput";
import { useEditor } from "../index";
import { useActions } from "../utilities/ActionHandler";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Interactable } from "../../../modifiers";
import { MeshBasicMaterial, Vector3 } from "three";
import { GroupProps, useThree } from "@react-three/fiber";
import { FacePlayer } from "../../../modifiers/FacePlayer";
import { FileInput } from "../../FileInput";
import { animated, useSpring } from "@react-spring/three";
import { ControlType, GLTFResult } from "../types/types";
import * as THREE from "three";
import { COLORS, FILE_URL, HOTBAR_SCALE } from "../constants/constants";
import { PropsHandler } from "./PropsHandler";

type SchemaProps = {
  active: string | null;
} & GroupProps;

export function SchemaEditor(props: SchemaProps) {
  const { active } = props;
  const [open, setOpen] = useState<boolean>(true);
  const [toggle, setToggle] = useState<boolean>(false);
  const [optionsHover, setOHover] = useState<boolean>(false);
  const [trashHover, setTHover] = useState<boolean>(false);
  const { editObject } = useEditor();
  const { nodes, materials } = useGLTF(FILE_URL) as GLTFResult;
  const premaMat = new MeshBasicMaterial({ color: COLORS.btnPrimary });
  const hamburgerMat = new MeshBasicMaterial({ color: COLORS.btnPrimary });
  const { scale, optionsColor, optionsPosZ, trashColor } = useSpring({
    scale: open ? HOTBAR_SCALE : 0,
    optionsColor: optionsHover ? COLORS.btnHovered : COLORS.btnSecondary,
    optionsPosZ: optionsHover ? 0.15 : 0,
    trashColor: trashHover ? COLORS.btnHovered : COLORS.textPrimary,
    config: {
      mass: 1,
    },
  });

  useEffect(() => {
    if (active === "rotation" || open) {
      setToggle(false);
    } else if (toggle === false) {
      setToggle(true);
    }
  }, [active]);

  return (
    <group name="premaPanel">
      <animated.group name="panel" scale={scale} rotation-x={0.25}>
        <group dispose={null} name="prema">
          <mesh
            name="prema"
            geometry={nodes["prema-panel"].geometry}
            material={premaMat}
          />
          {/*<Interactable*/}
          {/*  onHover={() => {*/}
          {/*    setTHover(true);*/}
          {/*  }}*/}
          {/*  onUnHover={() => {*/}
          {/*    setTHover(false);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <mesh name="trash" geometry={nodes.trash.geometry}>*/}
          {/*    <animated.meshBasicMaterial color={trashColor} />*/}
          {/*  </mesh>*/}
          {/*</Interactable>*/}
          <Interactable
            onHover={() => {
              setTHover(true);
            }}
            onUnHover={() => {
              setTHover(false);
            }}
            onClick={() => {
              setOpen(false);
            }}
          >
            <mesh name="close" geometry={nodes.close.geometry}>
              <animated.meshBasicMaterial color={trashColor} />
            </mesh>
          </Interactable>
          <Interactable
            onHover={() => {
              setTHover(true);
            }}
            onUnHover={() => {
              setTHover(false);
            }}
            onClick={() => {
              setOpen(false);
            }}
          >
            <mesh name="trash" geometry={nodes.check.geometry}>
              <animated.meshBasicMaterial color={trashColor} />
            </mesh>
          </Interactable>
        </group>
        <group name="premaContent" position={[-4.6, 4.54, 0.1]}>
          <Text fontSize={0.25} color="red">
            {editObject && editObject.name}
          </Text>
          <PropsHandler open={open} />
        </group>
      </animated.group>
      <Interactable
        onHover={() => {
          setOHover(true);
        }}
        onUnHover={() => {
          setOHover(false);
        }}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <group name="premaPanelClose" scale={HOTBAR_SCALE}>
          <group dispose={null} name="hamburger">
            <animated.group position-z={optionsPosZ}>
              <mesh
                name="hamburger"
                geometry={nodes.hamburger.geometry}
                material={hamburgerMat}
              />
            </animated.group>
            <mesh
              name="hamburger-click"
              geometry={nodes["props-click"].geometry}
            >
              <animated.meshBasicMaterial color={optionsColor} />
            </mesh>
            <Text
              position={[3.55, -0.33, 0.075]}
              fontSize={0.2}
              color={COLORS.textPrimary}
              textAlign="center"
              name="hamburger-btn-label"
            >
              Options
            </Text>
          </group>
        </group>
      </Interactable>
    </group>
  );
}
useGLTF.preload(FILE_URL);
