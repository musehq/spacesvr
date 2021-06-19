import { Move, Rotate, Scale } from "../components";
import { useState } from "react";
import { ControlType } from "../types/types";
import { Object3D } from "three";

type ControlProps = {
  object: Object3D | undefined;
};

export function ControlManager(props: ControlProps) {
  const { object } = props;
  const [active, setActive] = useState<ControlType>(null);

  return (
    <group>
      <Move
        object={object}
        active={active}
        setActive={setActive}
        position-x={-0.25}
      />
      <Rotate object={object} active={active} setActive={setActive} />
      <Scale
        object={object}
        active={active}
        setActive={setActive}
        position-x={0.25}
      />
    </group>
  );
}
