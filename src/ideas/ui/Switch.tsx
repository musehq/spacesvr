import { animated, useSpring } from "@react-spring/three";
import { VisualIdea } from "../basis/VisualIdea";
import { RoundedBox } from "../primitives/RoundedBox";
import { GroupProps } from "@react-three/fiber";
import { Raycaster } from "three";
import { Idea } from "../../logic/basis/idea";
import { useState } from "react";
import { cache } from "../../logic/cache";
import { HitBox } from "../primitives/HitBox";

type SwitchProps = {
  value?: boolean;
  onChange?: (value: boolean) => void;
  raycaster?: Raycaster;
} & GroupProps;

export function Switch(props: SwitchProps) {
  const { value, onChange, raycaster: passedRaycaster, ...rest } = props;

  const [localValue, setLocalValue] = useState(false);

  // if no value is passed, use local state
  const val = value ?? localValue;
  const setVal = (v: boolean) => {
    if (onChange) onChange(v);
    setLocalValue(v);
  };

  const SIZE = 0.075;
  const BORDER = SIZE * 0.05;
  const WIDTH = 2.5 * SIZE;
  const HEIGHT = SIZE * 0.75;
  const DEPTH = WIDTH * 0.1;
  const OUTER_WIDTH = WIDTH + BORDER * 2;
  const OUTER_HEIGHT = HEIGHT + BORDER;
  const KNOB_SIZE = SIZE * 0.8;

  const { posX, knobColor } = useSpring({
    posX: val ? WIDTH / 2 : -WIDTH / 2,
    knobColor: val ? "#417E25" : "#828282",
    config: { mass: 0.1 },
  });

  const [onIdea] = useState(new Idea(0, 0, 1));
  const [offIdea] = useState(new Idea(0, 0, 0.75));

  return (
    <group name="spacesvr-switch-input" {...rest}>
      <animated.group position-x={posX}>
        <VisualIdea scale={KNOB_SIZE} idea={val ? onIdea : offIdea} />
      </animated.group>
      <HitBox
        args={[KNOB_SIZE, KNOB_SIZE, KNOB_SIZE]}
        onClick={() => setVal(!val)}
        position-x={val ? WIDTH / 2 : -WIDTH / 2}
      />
      <HitBox
        args={[OUTER_WIDTH, OUTER_HEIGHT, DEPTH]}
        onClick={() => setVal(!val)}
      />
      <RoundedBox args={[WIDTH, HEIGHT, DEPTH]}>
        {/* @ts-ignore */}
        <animated.meshBasicMaterial color={knobColor} />
      </RoundedBox>
      <RoundedBox
        args={[OUTER_WIDTH, OUTER_HEIGHT, DEPTH]}
        material={cache.mat_basic_gray}
        position-z={-0.001}
      />
    </group>
  );
}
