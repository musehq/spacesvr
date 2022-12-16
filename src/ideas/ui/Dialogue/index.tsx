import { GroupProps } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Group } from "three";
import { animated, useSpring } from "@react-spring/three";
import { useLimitedFrame } from "../../../logic/limiter";
import { DialogueFSM } from "./logic/types";
import Bubbles from "./ideas/Bubbles";
import VisualInteraction from "./ideas/VisualInteraction";
import { FacePlayer } from "../../modifiers/FacePlayer";
import { cache } from "../../../logic/cache";
import { RoundedBox } from "../../primitives/RoundedBox";
export * from "./logic/types";

type DialogueProps = {
  dialogue: DialogueFSM;
  numStops?: number;
  side?: "left" | "right";
  offset?: GroupProps["position"];
  enabled?: boolean;
  face?: boolean;
} & GroupProps;

export function Dialogue(props: DialogueProps) {
  const {
    numStops = 5,
    enabled = true,
    side = "left",
    offset = [side === "right" ? 0.4 : -0.4, 0, 0],
    dialogue,
    face = true,
    ...rest
  } = props;

  const [curKey, setCurKey] = useState("init");
  const { scale } = useSpring({
    scale: enabled ? 1 : 0,
    delay: enabled ? (numStops + 1) * 60 : 0,
  });

  const group = useRef<Group>(null);

  useLimitedFrame(40, ({ camera }) => {
    if (!group.current) return;
    group.current.position.x += side === "right" ? WIDTH : -WIDTH;
    group.current.lookAt(camera.position);
    group.current.position.set(0, 0, 0);
  });

  const WIDTH = 1;
  const HEIGHT = 0.35;
  const DEPTH = 0.125;
  const POS_X = side === "right" ? WIDTH / 2 : -WIDTH / 2;

  return (
    <group name="dialogue" {...rest}>
      <FacePlayer enabled={face}>
        <Bubbles numStops={numStops} enabled={enabled} offset={offset} />
        <group name="main-dialogue" position={offset}>
          <group name="look-at" ref={group}>
            <animated.group scale={scale} position-x={POS_X}>
              <RoundedBox
                args={[WIDTH, HEIGHT, DEPTH]}
                material={cache.mat_standard_cream_double}
              />
              <group name="interactions" position-z={DEPTH / 2 + 0.003}>
                {dialogue.map((interaction) => (
                  <VisualInteraction
                    key={interaction.key}
                    interaction={interaction}
                    enabled={interaction.key === curKey}
                    setCurKey={setCurKey}
                    width={WIDTH}
                    height={HEIGHT}
                  />
                ))}
              </group>
            </animated.group>
          </group>
        </group>
      </FacePlayer>
    </group>
  );
}
