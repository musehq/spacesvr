import { useActions } from "../utilities/ActionHandler";
import { animated, useSpring } from "react-spring/three";
import { Interactable } from "../../../modifiers";
import { useEditor } from "../../EditMode";
import { useThree } from "@react-three/fiber";
import { Action } from "../types/types";

export function UndoRedo() {
  const actions = useActions();
  const { undoOpacity, redoOpacity } = useSpring({
    undoOpacity: actions.past.length === 0 ? 0.5 : 1,
    redoOpacity: actions.future.length === 0 ? 0.5 : 1,
    config: {
      mass: 1,
    },
  });

  function undoRedo(undo: boolean) {
    if (undo && actions.past.length > 0) {
      const action = actions.undo();
      (action as Action).target.applyMatrix4((action as Action).matrix);
    } else if (!undo && actions.future.length > 0) {
      const action = actions.redo();
      (action as Action).target.applyMatrix4((action as Action).matrix);
    }
  }

  return (
    <group scale={0.1} position={[-0.125, -0.2, 0]}>
      <Interactable
        onClick={() => {
          undoRedo(true);
        }}
      >
        <mesh name="undo">
          <boxBufferGeometry args={[2, 1, 0.25]} />
          <animated.meshBasicMaterial
            color="red"
            opacity={undoOpacity}
            transparent
          />
        </mesh>
      </Interactable>
      <Interactable
        onClick={() => {
          undoRedo(false);
        }}
      >
        <mesh name="redo" position-x={2.5}>
          <boxBufferGeometry args={[2, 1, 0.25]} />
          <animated.meshBasicMaterial
            color="green"
            opacity={redoOpacity}
            transparent
          />
        </mesh>
      </Interactable>
    </group>
  );
}
