import { useActions } from "../utilities/ActionHandler";
import { animated, useSpring } from "react-spring/three";
import { Interactable } from "../../../modifiers";
import { Action, GLTFResult } from "../types/types";
import { Text, useGLTF } from "@react-three/drei";
import { COLORS, FILE_URL, HOTBAR_SCALE } from "../constants/constants";
import React, { useState } from "react";
import { MeshBasicMaterial } from "three";

export function UndoRedo() {
  const actions = useActions();
  const [undoHover, setUHover] = useState<boolean>(false);
  const [redoHover, setRHover] = useState<boolean>(false);
  const { nodes, materials } = useGLTF(FILE_URL) as GLTFResult;
  const undoMat = new MeshBasicMaterial({ color: COLORS.btnPrimary });
  const {
    undoColor,
    redoColor,
    undoBColor,
    redoBColor,
    undoPosZ,
    redoPosZ,
  } = useSpring({
    undoColor: actions.past.length === 0 ? "#AAAAAA" : "#8F0000",
    redoColor: actions.future.length === 0 ? "#AAAAAA" : "#417E25",
    undoBColor: undoHover ? COLORS.btnHovered : COLORS.btnSecondary,
    redoBColor: redoHover ? COLORS.btnHovered : COLORS.btnSecondary,
    undoPosZ: actions.past.length !== 0 && undoHover ? 0.15 : 0,
    redoPosZ: actions.future.length !== 0 && redoHover ? 0.15 : 0,
    config: {
      mass: 1,
    },
  });

  function undoRedo(undo: boolean) {
    if (undo && actions.past.length > 0) {
      const { target, attribute, value } = actions.undo() as Action;
      // @ts-ignore
      target[attribute].set(value.x, value.y, value.z);
    } else if (!undo && actions.future.length > 0) {
      const { target, attribute, value } = actions.redo() as Action;
      // @ts-ignore
      target[attribute].set(value.x, value.y, value.z);
    }
  }

  return (
    <group scale={HOTBAR_SCALE}>
      <Interactable
        onHover={() => {
          setUHover(true);
        }}
        onUnHover={() => {
          setUHover(false);
        }}
        onClick={() => {
          undoRedo(true);
        }}
      >
        <group dispose={null} name="undo-btn">
          <animated.group position-z={undoPosZ}>
            <mesh name="undo" geometry={nodes.undo.geometry}>
              <animated.meshBasicMaterial color={undoColor} />
            </mesh>
          </animated.group>
          <mesh name="undo-click" geometry={nodes["undo-click"].geometry}>
            <animated.meshBasicMaterial color={undoBColor} />
          </mesh>
          <Text
            position={[-2.35, -0.33, 0.075]}
            fontSize={0.2}
            color={COLORS.textPrimary}
            textAlign="center"
            name="undo-btn-label"
          >
            Undo
          </Text>
        </group>
      </Interactable>
      <Interactable
        onHover={() => {
          setRHover(true);
        }}
        onUnHover={() => {
          setRHover(false);
        }}
        onClick={() => {
          undoRedo(false);
        }}
      >
        <group dispose={null} name="redo">
          <animated.group position-z={redoPosZ}>
            <mesh name="redo" geometry={nodes.redo.geometry}>
              <animated.meshBasicMaterial color={redoColor} />
            </mesh>
          </animated.group>
          <mesh name="redo-click" geometry={nodes["redo-click"].geometry}>
            <animated.meshBasicMaterial color={redoBColor} />
          </mesh>
          <Text
            position={[-1.65, -0.33, 0.075]}
            fontSize={0.2}
            color={COLORS.textPrimary}
            textAlign="center"
            name="redo-btn-label"
          >
            Redo
          </Text>
        </group>
      </Interactable>
    </group>
  );
}
useGLTF.preload(FILE_URL);
