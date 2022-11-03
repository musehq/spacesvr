import { ReactNode, useEffect } from "react";
import { ToolKey } from "../../../layers/Toolbelt/types/char";
import { useToolbelt } from "../../../layers/Toolbelt";
import HUD from "./modifiers/HUD";
import { useSpring } from "@react-spring/three";
import { useVisible } from "../../../logic/visible";
import Draggable from "./modifiers/Draggable";
import { createPortal } from "@react-three/fiber";

type ToolProps = {
  children: ReactNode;
  name: string;
  keymap: ToolKey;
  pos?: [number, number];
  face?: boolean;
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
    t = 0.01,
  } = props;

  const toolbelt = useToolbelt();
  const ENABLED = toolbelt.activeTool?.name === name;

  const DISTANCE = 1;

  const { prog } = useSpring({ prog: ENABLED ? 1 : 0 });
  const visible = useVisible(prog);

  useEffect(() => {
    toolbelt.grant(name, keymap);
    return () => toolbelt.revoke(name);
  }, [name, keymap, toolbelt.grant, toolbelt.revoke]);

  return (
    <>
      {createPortal(
        <group name={`tool-${name}`} visible={visible}>
          <HUD pos={pos} face={face} pinY={pinY} t={t} distance={DISTANCE}>
            <Draggable distance={DISTANCE} name={name}>
              {children}
            </Draggable>
          </HUD>
        </group>,
        toolbelt.hudScene
      )}
    </>
  );
}