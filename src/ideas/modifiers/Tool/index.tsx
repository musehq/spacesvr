import { ReactNode, useEffect } from "react";
import { useToolbelt } from "../../../layers/Toolbelt";
import HUD from "./modifiers/HUD";
import { useSpring } from "@react-spring/three";
import { useVisible } from "../../../logic/visible";
import OnScreen from "./modifiers/OnScreen";
import { createPortal } from "@react-three/fiber";
import { FacePlayer } from "../FacePlayer";

type ToolProps = {
  children: ReactNode;
  name: string;
  pos?: [number, number];
  face?: boolean;
  pinY?: boolean;
  range?: number;
  orderIndex?: number;
  onSwitch?: (enabled: boolean) => void;
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
    pos = [0, 0],
    face = true,
    pinY = false,
    range = 0,
    orderIndex,
    onSwitch,
  } = props;

  const toolbelt = useToolbelt();
  const ENABLED = toolbelt.activeTool?.name === name;

  const DISTANCE = 1;

  const { prog } = useSpring({
    prog: ENABLED ? 1 : 0,
    config: { mass: 4, friction: 90, tension: 800 },
  });
  const visible = useVisible(prog);

  useEffect(() => {
    toolbelt.grant(name, orderIndex);
    return () => toolbelt.revoke(name);
  }, [name, toolbelt.grant, toolbelt.revoke, orderIndex]);

  useEffect(() => {
    if (onSwitch) onSwitch(toolbelt.activeTool?.name === name);
  }, [toolbelt.activeTool, onSwitch, name]);

  return (
    <>
      {createPortal(
        <group name={`tool-${name}`} visible={visible}>
          <HUD pos={pos} pinY={pinY} distance={DISTANCE} range={range}>
            <OnScreen distance={DISTANCE} name={name} pos={pos}>
              <FacePlayer enabled={face}>{children}</FacePlayer>
            </OnScreen>
          </HUD>
        </group>,
        toolbelt.hudScene
      )}
    </>
  );
}
