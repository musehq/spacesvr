import { animated, useSpring } from "@react-spring/three";
import { VisualIdea } from "../basis/VisualIdea";
import { RoundedBox } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { Raycaster } from "three";
import { Interactable } from "../modifiers/Interactable";
import { Idea } from "../../logic/basis/idea";
import { useState } from "react";

type SwitchProps = {
  value?: boolean;
  setValue?: (value: boolean) => void;
  raycaster?: Raycaster;
} & GroupProps;

export default function Switch(props: SwitchProps) {
  const { value, setValue, raycaster: passedRaycaster, ...rest } = props;

  const [localValue, setLocalValue] = useState(false);

  // if no value is passed, use local state
  const val = value ?? localValue;
  const setVal = setValue ?? setLocalValue;

  const SIZE = 0.075;
  const BORDER = SIZE * 0.05;
  const WIDTH = 2.5 * SIZE;
  const HEIGHT = SIZE * 0.75;
  const DEPTH = WIDTH * 0.1;
  const OUTER_WIDTH = WIDTH + BORDER * 2;
  const OUTER_HEIGHT = HEIGHT + BORDER;
  const KNOB_SIZE = SIZE * 0.8;
  const RADIUS = Math.min(WIDTH, HEIGHT, DEPTH) * 0.5;

  const { posX, knobColor } = useSpring({
    posX: val ? WIDTH / 2 : -WIDTH / 2,
    knobColor: val ? "#417E25" : "#828282",
    config: { mass: 0.1 },
  });

  const [onIdea] = useState(new Idea().setFromCreation(0, 0, 1));
  const [offIdea] = useState(new Idea().setFromCreation(0, 0, 0.75));

  return (
    <group name="spacesvr-switch-input" {...rest}>
      <Interactable onClick={() => setVal(!val)} raycaster={passedRaycaster}>
        <animated.group position-x={posX}>
          <VisualIdea scale={KNOB_SIZE} idea={val ? onIdea : offIdea} />
        </animated.group>
        <RoundedBox
          args={[WIDTH, HEIGHT, DEPTH]}
          smoothness={8}
          radius={RADIUS}
        >
          {/* @ts-ignore */}
          <animated.meshBasicMaterial color={knobColor} />
        </RoundedBox>
        <RoundedBox
          args={[OUTER_WIDTH, OUTER_HEIGHT, DEPTH]}
          radius={RADIUS}
          smoothness={8}
          position-z={-0.001}
        >
          <animated.meshBasicMaterial color="#828282" />
        </RoundedBox>
      </Interactable>
    </group>
  );
}
