import { a, useSpring } from "@react-spring/three";
import { Text } from "@react-three/drei";
import { Floating, Key } from "../../../ideas";
import { useEnvironment } from "../../../layers";

const FONT_FILE =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

type InstructionProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function Instruction(props: InstructionProps) {
  const { open, setOpen } = props;

  const { device } = useEnvironment();

  const CLOSED_SCALE = device.mobile ? 0.5 : 0.5;

  const { scale } = useSpring({ scale: open ? 0 : CLOSED_SCALE });

  const FONT_SIZE = 0.055;

  const DESKTOP_TEXT = `Press          to ${open ? "close" : "open"}`;
  const MOBILE_TEXT = "tap to open";

  return (
    <a.group
      scale={scale}
      position-x={device.mobile ? -0.05 : -0.45}
      position-y={device.mobile ? -0.2 : 0.1}
      position-z={0.25}
      rotation-x={0.1}
      rotation-y={-0.4}
    >
      <Floating height={FONT_SIZE * 0.1} speed={device.mobile ? 8 : 0}>
        <Text
          color="white"
          fontSize={FONT_SIZE}
          maxWidth={100}
          textAlign="center"
          outlineColor="black"
          outlineWidth={FONT_SIZE * 0.1}
          font={FONT_FILE}
          position-y={-0.02}
        >
          {device.mobile ? MOBILE_TEXT : DESKTOP_TEXT}
        </Text>
      </Floating>
      {device.desktop && (
        <Floating height={FONT_SIZE * 0.1} speed={8}>
          <Key
            keyCode="C"
            keyPress={["c", "C"]}
            scale={0.1}
            position-x={-0.035}
            position-z={0.1}
            rotation-x={-0.3}
          />
        </Floating>
      )}
    </a.group>
  );
}
