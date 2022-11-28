import { useEffect, useMemo, useState } from "react";
import { animated, useSpring } from "@react-spring/three";
import { Text } from "@react-three/drei";
import { TextInput } from "../../TextInput";
import { Interaction } from "../logic/types";
import VisualDecisions from "./VisualDecisions";

const FONT_FILE =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

type InteractionProps = {
  interaction: Interaction;
  enabled: boolean;
  width: number;
  height: number;
  setCurKey: (key: string) => void;
};

export default function VisualInteraction(props: InteractionProps) {
  const { interaction, enabled, width, height, setCurKey } = props;
  const { effect, text, input, decisions } = interaction;

  const [prevEnabled, setPrevEnabled] = useState(false);

  const { posZ, scaleY } = useSpring({
    posZ: enabled ? 0.003 : -0.003,
    scaleY: enabled ? 1 : 0,
  });

  const onSubmit = useMemo(() => {
    if (!decisions)
      return () => {
        return;
      };
    for (const decision of decisions) {
      if (decision.name === "submit") {
        return () => {
          if (decision.onClick) decision.onClick();
          if (decision.nextKey) setCurKey(decision.nextKey || "");
        };
      }
    }
  }, [decisions, setCurKey]);

  useEffect(() => {
    if (prevEnabled !== enabled) {
      setPrevEnabled(enabled);
      if (enabled && effect) {
        effect().then((newKey: string) => {
          if (newKey) {
            setCurKey(newKey);
          }
        });
      }
    }
  }, [effect, setCurKey, prevEnabled, enabled]);

  const textStyles: Partial<typeof Text.defaultProps> = {
    font: FONT_FILE,
    maxWidth: 0.8,
    textAlign: "center",
    fontSize: 0.06,
    outlineWidth: 0.0065,
    renderOrder: 10,
  };

  if (!enabled) return null;

  return (
    <animated.group
      name={`interaction-${text}`}
      position-z={posZ}
      scale-y={scaleY}
    >
      <Text {...textStyles} anchorY={input ? "bottom" : "middle"}>
        {text}
      </Text>
      {input && (input.persist || enabled) && (
        <TextInput
          value={input.value}
          onChange={input.setValue}
          position-y={-0.065}
          onSubmit={onSubmit}
          fontSize={0.06}
          width={width * 0.825}
          type={input.type === "email" ? "text" : input.type}
        />
      )}
      <group position-y={-height / 2}>
        {decisions && (
          <VisualDecisions
            decisions={decisions}
            width={width}
            setCurKey={setCurKey}
          />
        )}
      </group>
    </animated.group>
  );
}
