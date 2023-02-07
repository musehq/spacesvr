import { GroupProps } from "@react-three/fiber";
import { animated, config, useSpring } from "@react-spring/three";
import { Button, HitBox, RoundedBox } from "../../../ideas";
import { cache } from "../../../logic";
import { useEffect } from "react";
import { useEnvironment } from "../../../layers";

type ShutterButton = {
  pressed: boolean;
  setPressed: (pressed: boolean) => void;
  onPress: () => void;
} & GroupProps;

export default function ShutterButton(props: ShutterButton) {
  const { pressed, setPressed, onPress, ...rest } = props;

  const { device } = useEnvironment();

  useEffect(() => {
    if (pressed) setTimeout(() => setPressed(false), 750);
  }, [pressed, setPressed]);

  const { shutterY } = useSpring({
    shutterY: !pressed ? 1 : 0.6,
    config: config.stiff,
  });

  return (
    <group {...rest}>
      <animated.group scale-y={shutterY}>
        <RoundedBox args={[0.4, 0.55, 0.2]} material={cache.mat_standard_red} />
      </animated.group>
      {device.mobile && (
        <HitBox
          args={[0.4, 0.55, 0.2]}
          onClick={onPress}
          scale={1.5}
          position-y={0.2}
        >
          close
        </HitBox>
      )}
    </group>
  );
}
