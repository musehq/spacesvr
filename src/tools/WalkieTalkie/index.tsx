import { Tool } from "../../ideas/modifiers/Tool";
import { Text } from "@react-three/drei";
import TalkieModel from "./components/TalkieModel";
import MicAccess from "./components/MicAccess";
import SpeakerAccess from "./components/SpeakerAccess";

const FONT_URL =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

export function WalkieTalkie() {
  const TOOL_NAME = "Walkie Talkie";

  const WIDTH = 0.5;
  const HEIGHT = 0.5;
  const DEPTH = 0.1;

  return (
    <Tool name={TOOL_NAME} pos={[0, 0]} range={0.3} pinY>
      <group position-y={-0.05} scale={1.25}>
        <TalkieModel width={WIDTH} height={HEIGHT} depth={DEPTH} />
        <group name="content" position-z={0.1 / 2 + 0.001}>
          <MicAccess position-y={0.11} width={WIDTH * 0.65} />
          <Text
            fontSize={0.0225}
            color="black"
            font={FONT_URL}
            maxWidth={WIDTH * 0.65}
            anchorY="top"
            position-y={-0.11}
            textAlign="center"
          >
            proximity voice chat is enabled in this world. walk up to someone
            and talk!
          </Text>
          {/*<SpeakerAccess position-y={-0.025} width={WIDTH * 0.65} />*/}
        </group>
      </group>
    </Tool>
  );
}
