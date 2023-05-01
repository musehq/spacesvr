import { ReactNode, useEffect, Suspense, useState } from "react";
import { useToolbelt } from "../../../layers/Toolbelt";
import HUD from "./modifiers/HUD";
import { useSpring } from "@react-spring/three";
import { useVisible } from "../../../logic/visible";
import OnScreen from "./modifiers/OnScreen";
import { createPortal } from "@react-three/fiber";
import { FacePlayer } from "../FacePlayer";
import ToolPreload from "./components/ToolPreload";

type ToolProps = {
  children: ReactNode;
  name: string;
  icon?: string;
  pos?: [number, number];
  face?: boolean;
  pinY?: boolean;
  range?: number;
  orderIndex?: number;
  bobStrength?: number;
  disableDraggable?: boolean;
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
    icon,
    pos = [0, 0],
    face = true,
    pinY = false,
    range,
    bobStrength,
    orderIndex,
    disableDraggable = false,
    onSwitch,
  } = props;

  const { grant, revoke, activeTool, hudScene } = useToolbelt();
  const ENABLED = activeTool?.name === name;
  const DISTANCE = 1;

  const [preloadDone, setPreloadDone] = useState(false);

  const { prog } = useSpring({
    prog: ENABLED ? 1 : 0,
    config: { mass: 4, friction: 90, tension: 800 },
  });

  const visible = useVisible(prog);

  useEffect(() => {
    grant(name, icon, orderIndex);
    return () => revoke(name);
  }, [name, icon, grant, revoke, orderIndex]);

  useEffect(() => {
    if (onSwitch) onSwitch(activeTool?.name === name);
  }, [activeTool, onSwitch, name]);

  if (!preloadDone) {
    return (
      <ToolPreload setPreloadDone={setPreloadDone}>{children}</ToolPreload>
    );
  }

  if (!visible) return null;

  return (
    <>
      {createPortal(
        <group name={`tool-${name}`}>
          <HUD
            pos={pos}
            pinY={pinY}
            distance={DISTANCE}
            range={range}
            bobStrength={bobStrength}
          >
            <OnScreen
              distance={DISTANCE}
              name={name}
              pos={pos}
              disableDraggable={disableDraggable}
            >
              <FacePlayer enabled={face}>
                <Suspense fallback={null}>{visible && children}</Suspense>
              </FacePlayer>
            </OnScreen>
          </HUD>
        </group>,
        hudScene
      )}
    </>
  );
}
