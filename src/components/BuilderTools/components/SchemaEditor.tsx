import { Text, useGLTF } from "@react-three/drei";
import { TextInput } from "../../TextInput";
import { useEditor } from "../../EditMode";
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

type SchemaProps = {
  active: string | null;
} & GroupProps;

export function SchemaEditor(props: SchemaProps) {
  const { active } = props;
  const [open, setOpen] = useState<boolean>(true);
  const [toggle, setToggle] = useState<boolean>(false);
  const [optionsHover, setOHover] = useState<boolean>(false);
  const { editObject, editor, mouseDown, intersection } = useEditor();
  const actions = useActions();
  const { camera } = useThree();
  const [value, setValue] = useState<string>(""),
    [enabled, setEnabled] = useState<boolean>(false);
  const { nodes, materials } = useGLTF(FILE_URL) as GLTFResult;
  const premaMat = new MeshBasicMaterial({ color: COLORS.btnPrimary });
  const hamburgerMat = new MeshBasicMaterial({ color: COLORS.btnPrimary });
  const { scale, toggleScale, optionsColor, optionsPosZ } = useSpring({
    scale: open ? HOTBAR_SCALE : 0,
    toggleScale: toggle ? 1 : 0,
    optionsColor: optionsHover ? COLORS.btnHovered : COLORS.btnSecondary,
    optionsPosZ: optionsHover ? 0.15 : 0,
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
      <animated.group name="panel" scale={scale}>
        <group dispose={null} name="prema">
          <mesh
            name="prema"
            geometry={nodes["prema-panel"].geometry}
            material={premaMat}
          />
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
