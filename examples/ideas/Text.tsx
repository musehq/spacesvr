import { ReactNode } from "react";
import { GroupProps } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { DoubleSide } from "three";

type TestProps = {
  children: ReactNode | ReactNode[];
  name: string;
  sideLength?: number;
} & GroupProps;

const FONT = "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

export default function Test(props: TestProps) {
  const { children, name, sideLength = 1.1, ...rest } = props;

  const FONT_SIZE = 0.075;

  return (
    <group name="test" {...rest}>
      <group
        name="content"
        position={[0, sideLength / 2 + 0.001, -sideLength / 2]}
      >
        {children}
        <mesh>
          <boxBufferGeometry args={[sideLength, sideLength, sideLength]} />
          <meshBasicMaterial color="black" wireframe />
        </mesh>
      </group>
      <group
        name="nameplate"
        position-y={(FONT_SIZE + 0.1 + 0.1) / 2}
        position-z={FONT_SIZE / 2}
        rotation-x={-0.8}
      >
        <mesh>
          <planeBufferGeometry args={[sideLength, FONT_SIZE + 0.1]} />
          <meshBasicMaterial color="black" side={DoubleSide} />
        </mesh>
        <Text
          color="white"
          font={FONT}
          maxWidth={sideLength}
          fontSize={FONT_SIZE}
          position-z={0.001}
        >
          {name}
        </Text>
      </group>
    </group>
  );
}
