import { useActions } from "../utilities/ActionHandler";
import { animated, useSpring } from "react-spring/three";
import { Interactable } from "../../../modifiers";
import { useEditor } from "../../EditMode";
import { useThree } from "@react-three/fiber";
import { Action } from "../types/types";
import { Text } from "@react-three/drei";

export function UndoRedo() {
  const actions = useActions();
  const { scene } = useThree();
  const { undoOpacity, redoOpacity } = useSpring({
    undoOpacity: actions.past.length === 0 ? 0.5 : 1,
    redoOpacity: actions.future.length === 0 ? 0.5 : 1,
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
    <group scale={0.1} position={[-0.125, -0.2, 0]}>
      <Interactable
        onClick={() => {
          undoRedo(true);
        }}
      >
        <group name="undo">
          <mesh>
            <boxBufferGeometry args={[2, 1, 0.25]} />
            <animated.meshBasicMaterial
              color="red"
              opacity={undoOpacity}
              transparent
            />
          </mesh>
          <mesh position-z={0.1}>
            <boxBufferGeometry args={[1.9, 0.9, 0.15]} />
            <animated.meshBasicMaterial
              color="white"
              opacity={undoOpacity}
              transparent
            />
          </mesh>
          <Text fontSize={0.5} position-z={0.25} color="red">
            Undo
          </Text>
        </group>
      </Interactable>
      <Interactable
        onClick={() => {
          undoRedo(false);
        }}
      >
        <group position-x={2.5} name="redo">
          <mesh>
            <boxBufferGeometry args={[2, 1, 0.25]} />
            <animated.meshBasicMaterial
              color="green"
              opacity={redoOpacity}
              transparent
            />
          </mesh>
          <mesh position-z={0.1}>
            <boxBufferGeometry args={[1.9, 0.9, 0.15]} />
            <animated.meshBasicMaterial
              color="white"
              opacity={undoOpacity}
              transparent
            />
          </mesh>
          <Text fontSize={0.5} position-z={0.25} color="green">
            Redo
          </Text>
        </group>
      </Interactable>
    </group>
  );
}
