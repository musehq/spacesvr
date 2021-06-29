import {
  Move,
  Rotate,
  Scale,
  SchemaEditor,
  UndoRedo,
  Publish,
} from "../components";
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
        <HotbarModel scale={0.1} />
        {/*<PlaceholderModel scale={0.1} />*/}
        <UndoRedo />
        <SchemaEditor active={active} />
        <Move active={active} setActive={setActive} name="move" />
        <Rotate active={active} setActive={setActive} name="rotate" />
        <Scale active={active} setActive={setActive} name="scale" />
        <Publish />
      </group>
    </ActionHandler>
  );
}
