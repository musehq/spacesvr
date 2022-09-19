import { ReactNode, useEffect } from "react";
import { ToolKey } from "../../../layers/Toolbelt/types/char";
import { useToolbelt } from "../../../layers/Toolbelt";
import HUD from "./modifiers/HUD";
import { useSpring, animated } from "@react-spring/three";
import { useVisible } from "../../../logic/visible";

type ToolProps = {
  children: ReactNode;
  name: string;
  keymap: ToolKey;
  pos?: [number, number];
  face?: boolean;
  distance?: number;
  pinY?: boolean;
  t?: number;
};

/**
 * Tool modifier will place its children in constant view of the camera
 *
 * pos will determine relative placement on [x, y] axis
 * face will make item face the player (defaults to true)
 *
 * @param props
 * @constructor
 */
export function Tool(props: ToolProps) {
  const {
    children,
    name,
    keymap,
    pos,
    face = true,
    pinY = false,
    distance = 1,
    t = 0.01,
  } = props;

  const toolbelt = useToolbelt();
  const ENABLED = toolbelt.activeTool?.name === name;

  const { posY, prog } = useSpring({
    posY: ENABLED ? 0 : -30,
    prog: ENABLED ? 1 : 0,
  });

  const visible = useVisible(prog);

  useEffect(() => {
    toolbelt.grant(name, keymap);
    return () => {
      toolbelt.revoke(name);
    };
  }, [name, keymap, toolbelt.grant, toolbelt.revoke, toolbelt]);

  return (
    <group name={`tool-${name}`}>
      <HUD pos={pos} face={face} pinY={pinY} distance={distance} t={t}>
        <animated.group position-y={posY}>{visible && children}</animated.group>
      </HUD>
    </group>
  );
}
