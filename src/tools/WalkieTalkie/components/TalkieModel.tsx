import { RoundedBox } from "../../../ideas/primitives/RoundedBox";
import { useModifiedStandardShader } from "../../../logic/material";
import { frag, vert } from "../materials/walkie";

type TalkieModelProps = {
  width: number;
  height: number;
  depth: number;
};

export default function TalkieModel(props: TalkieModelProps) {
  const { width, height, depth } = props;

  const mat = useModifiedStandardShader({ color: "#cbcbcb" }, vert, frag);

  const ANTENNA_WIDTH = width * 0.22;
  const ANTENNA_HEIGHT = height * 0.45;

  return (
    <group name="model">
      <RoundedBox args={[width, height, depth]} material={mat} />
      <RoundedBox
        args={[ANTENNA_WIDTH, ANTENNA_HEIGHT, depth]}
        material={mat}
        position-x={-width / 2 + ANTENNA_WIDTH / 2}
        position-y={height / 2}
      />
    </group>
  );
}
