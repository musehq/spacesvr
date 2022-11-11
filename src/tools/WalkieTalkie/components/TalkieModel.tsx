import { RoundedBox } from "@react-three/drei";
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
      <RoundedBox
        args={[width, height, depth]}
        radius={Math.min(width, height, depth) * 0.5}
        material={mat}
        smoothness={10}
      />
      <RoundedBox
        args={[ANTENNA_WIDTH, ANTENNA_HEIGHT, depth]}
        material={mat}
        radius={Math.min(ANTENNA_WIDTH, height, depth) * 0.5}
        position-x={-width / 2 + ANTENNA_WIDTH / 2}
        position-y={height / 2}
        smoothness={10}
      />
    </group>
  );
}
