import { GroupProps } from "@react-three/fiber";
import { animated, config, useSpring } from "@react-spring/three";
import { Floating, HitBox, RoundedBox } from "../../../ideas";
import { cache } from "../../../logic";
import { useEffect, useState } from "react";
import { useEnvironment } from "../../../layers";
import { Text } from "@react-three/drei";

type ShutterButton = {
  open: boolean;
  pressed: boolean;
  setPressed: (pressed: boolean) => void;
  onPress: () => void;
} & GroupProps;

const FONT_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

export default function ShutterButton(props: ShutterButton) {
  const { open, pressed, setPressed, onPress, ...rest } = props;

  const { device } = useEnvironment();

  const [pressedOnce, setPressedOnce] = useState(false);

  useEffect(() => {
    if (pressed) {
      setTimeout(() => setPressed(false), 750);
      setPressedOnce(true);
    }
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
      {!pressedOnce && open && device.mobile && (
        <Floating height={0.025} speed={15}>
          <Text
            font={FONT_URL}
            fontSize={0.15}
            color="white"
            outlineColor="black"
            outlineWidth={0.15 / 10}
            anchorY="bottom"
            position-y={0.325}
          >
            Tap to Shoot!
          </Text>
        </Floating>
      )}
      <mesh
        name="cover-mesh"
        position-x={0.05}
        material={cache.mat_standard_black}
        position-y={-0.17}
      >
        <boxGeometry args={[0.5, 0.5, 0.3]} />
      </mesh>
    </group>
  );
}
