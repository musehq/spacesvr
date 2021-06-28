import { Move, Rotate, Scale, SchemaEditor, UndoRedo } from "../components";
import { useState } from "react";
import { ControlType } from "../types/types";
import { ActionHandler } from "../utilities/ActionHandler";

export function ControlManager() {
  const [active, setActive] = useState<ControlType>(null);

  return (
    <ActionHandler>
      <group name="editControls" position-y={-0.015}>
        <UndoRedo />
        <SchemaEditor active={active} />
        <Move
          active={active}
          setActive={setActive}
          position-x={-0.25}
          name="move"
        />
        <Rotate active={active} setActive={setActive} name="rotate" />
        <Scale
          active={active}
          setActive={setActive}
          position-x={0.25}
          name="scale"
        />
      </group>
    </ActionHandler>
  );
}
