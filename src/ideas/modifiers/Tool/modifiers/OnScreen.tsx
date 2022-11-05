import { useThree } from "@react-three/fiber";
import { ReactNode, useEffect, useRef } from "react";
import { animated, useSpring } from "@react-spring/three";
import { PerspectiveCamera } from "three";
import { useToolbelt } from "../../../../layers/Toolbelt";
import { getHudPos } from "../logic/screen";
import Draggable from "./Draggable";

type OnScreenProps = {
  distance: number;
  name: string;
  pos: [number, number];
  children: ReactNode | ReactNode[];
};

export default function OnScreen(props: OnScreenProps) {
  const { distance, name, pos, children } = props;

  const toolbelt = useToolbelt();

  const camera = useThree((state) => state.camera);

  const TOOL = toolbelt.tools.find((t) => t.name == name);
  const TOOL_INDEX = TOOL ? toolbelt.tools.indexOf(TOOL) : undefined;
  const ENABLED = toolbelt.activeIndex === TOOL_INDEX;

  const [spring, set] = useSpring(() => ({
    pos: [0, 0, 0] as [number, number, number],
    config: { mass: 4, friction: 90, tension: 800 },
  }));

  // animate position on tool switches
  const lastActiveIndex = useRef<number>();
  useEffect(() => {
    if (lastActiveIndex.current === toolbelt.activeIndex) return;
    lastActiveIndex.current = toolbelt.activeIndex;
    if (TOOL_INDEX === undefined) return;

    const _cam = camera as PerspectiveCamera;
    const AMT = 1.5;

    if (toolbelt.activeTool === undefined) {
      // hide it
      set({ pos: [0, -1, distance] });
    } else if (ENABLED) {
      // show it
      if (toolbelt.direction !== "up") {
        // unless the tool was hidden as will fly in bottom to top,
        const { x: leftX } = getHudPos([-AMT, 0], _cam, distance);
        const { x: rightX } = getHudPos([AMT, 0], _cam, distance);
        const { x } = getHudPos(pos, _cam, distance);

        const swipeInX = toolbelt.direction === "left" ? rightX - x : leftX + x;
        spring.pos.update({ immediate: true });
        set({ pos: [swipeInX, 0, distance] });
        spring.pos.finish();
        spring.pos.update({ immediate: false });
      }

      set({ pos: [0, 0, 0] });
    } else {
      // swipe it away
      const { x: leftX } = getHudPos([-AMT, 0], _cam, distance * 2);
      const { x: rightX } = getHudPos([AMT, 0], _cam, distance * 2);
      const { x } = getHudPos(pos, _cam, distance);
      const swipeOutX = (toolbelt.direction === "left" ? leftX : rightX) - x;
      set({ pos: [swipeOutX, 0, 0] });
    }
  }, [
    ENABLED,
    TOOL_INDEX,
    camera,
    distance,
    pos,
    set,
    spring.pos,
    toolbelt.activeTool,
    toolbelt.direction,
  ]);

  return (
    <animated.group position={spring.pos} name="onscreen">
      <Draggable set={set} distance={distance} enabled={ENABLED}>
        {children}
      </Draggable>
    </animated.group>
  );
}
