import { ReactNode, useEffect } from "react";
import { ToolKey } from "../../../layers/Toolbelt/types/char";
import { useToolbelt } from "../../../layers/Toolbelt";
import HUD from "./modifiers/HUD";
import { useSpring } from "@react-spring/three";
import { useVisible } from "../../../logic/visible";
import Draggable from "./modifiers/Draggable";
import { createPortal } from "@react-three/fiber";
import { FacePlayer } from "../FacePlayer";

type ToolProps = {
  children: ReactNode;
  name: string;
  keymap: ToolKey;
  pos?: [number, number];
  face?: boolean;
  pinY?: boolean;
  t?: number;
  orderIndex?: number;
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
    pos = [0, 0],
    face = true,
    pinY = false,
    t = 0.01,
    orderIndex,
  } = props;

  const toolbelt = useToolbelt();
  const ENABLED = toolbelt.activeTool?.name === name;

  const DISTANCE = 1;

  const { prog } = useSpring({ prog: ENABLED ? 1 : 0 });
  const visible = useVisible(prog);

  useEffect(() => {
    toolbelt.grant(name, keymap, orderIndex);
    return () => toolbelt.revoke(name);
  }, [name, keymap, toolbelt.grant, toolbelt.revoke, orderIndex]);

  return (
    <>
      {createPortal(
        <group name={`tool-${name}`} visible={visible}>
          <HUD pos={pos} pinY={pinY} t={t} distance={DISTANCE}>
            <Draggable
              distance={DISTANCE}
              name={name}
              enabled={ENABLED}
              pos={pos}
            >
              <FacePlayer enabled={face}>{children}</FacePlayer>
            </Draggable>
          </HUD>
        </group>,
        toolbelt.hudScene
      )}
    </>
  );
}
