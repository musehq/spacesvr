import { GroupProps } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { RoundedBox } from "../../../ideas/primitives/RoundedBox";
import { cache } from "../../../logic/cache";

type RequestProps = { width: number } & GroupProps;

export default function Request(props: RequestProps) {
  const { width, ...rest } = props;

  const FONT_SIZE = 0.0225;
  const DEPTH = 0.01;
  const PADDING_Y = 0.0125;

  const NOT_AVAILABLE =
    !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia;
  const message = NOT_AVAILABLE
    ? "this site cannot access your microphone"
    : `give this site access to your microphone to talk!`;

  return (
    <group {...rest}>
      <Text
        fontSize={FONT_SIZE}
        color="black"
        position-z={DEPTH / 2 + 0.001}
        maxWidth={width}
        textAlign="center"
      >
        {message}
      </Text>
      <RoundedBox
        args={[width, FONT_SIZE * 2 + PADDING_Y * 4, DEPTH]}
        material={cache.mat_standard_white}
      />
    </group>
  );
}
