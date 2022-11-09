import { useState } from "react";
import { Tool } from "../../ideas/modifiers/Tool";
import { useEnvironment } from "../../layers/Environment";
import { useSpring, a } from "@react-spring/three";
import Icon from "./components/Icon";
import Instruction from "./components/Instruction";
import Panel from "./components/Panel";

export function Cart() {
  const TOOL_NAME = "Cart";

  const { device } = useEnvironment();

  const VAL = 0.9;
  const [open, setOpen] = useState(false);

  const pos: [number, number] = open
    ? [0, 0]
    : device.mobile
    ? [-VAL, VAL]
    : [-VAL, -VAL];

  const { posY } = useSpring({ posY: open ? 0.25 : 0 });

  return (
    <Tool
      name={TOOL_NAME}
      pos={pos}
      pinY={!open || device.mobile}
      range={open ? 0.45 : 0}
      orderIndex={10}
    >
      <a.group position-y={posY} name="container">
        <Icon open={open} setOpen={setOpen} />
        <Panel open={open} />
        <Instruction open={open} setOpen={setOpen} />
      </a.group>
    </Tool>
  );
}
