import { Move, Rotate, Scale, SchemaEditor, UndoRedo } from "../components";
import { useState } from "react";
import { ControlType } from "../types/types";
import { ActionHandler } from "../utilities/ActionHandler";
import Hotbar, {
  HamburgerModel,
  HotbarModel,
  MoveModel,
  RedoModel,
  RotateModel,
  ScaleModel,
  UndoModel,
  PublishModel,
  PlaceholderModel,
  PremaModel,
  CloseModel,
  TrashModel,
} from "../models/Hotbar";

export function ControlManager() {
  const [active, setActive] = useState<ControlType>(null);

  return (
    <ActionHandler>
      <group name="editControls" position-y={-0.015}>
        {/*<MoveModel scale={0.1} />*/}
        <RotateModel scale={0.1} />
        <ScaleModel scale={0.1} />
        <UndoModel scale={0.1} />
        <RedoModel scale={0.1} />
        <HotbarModel scale={0.1} />
        <HamburgerModel scale={0.1} />
        <PublishModel scale={0.1} />
        <PlaceholderModel scale={0.1} />
        <PremaModel scale={0.1} />
        <CloseModel scale={0.1} />
        <TrashModel scale={0.1} />
        {/*<UndoRedo />*/}
        {/*<SchemaEditor active={active} />*/}
        <Move
          active={active}
          setActive={setActive}
          // position-x={-0.25}
          name="move"
        />
        {/*<Rotate active={active} setActive={setActive} name="rotate" />*/}
        {/*<Scale*/}
        {/*  active={active}*/}
        {/*  setActive={setActive}*/}
        {/*  position-x={0.25}*/}
        {/*  name="scale"*/}
        {/*/>*/}
      </group>
    </ActionHandler>
  );
}
