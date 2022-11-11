import { GroupProps } from "@react-three/fiber";
import { ReactNode } from "react";

type PaneProps = {
  width: number;
  height: number;
  children?: ReactNode | ReactNode[];
} & GroupProps;

export default function Pane(props: PaneProps) {
  const { width, height, children, ...rest } = props;

  const BORDER = 0.0075;

  return (
    <group name="pane" {...rest}>
      <mesh>
        <planeBufferGeometry args={[width + BORDER * 2, height + BORDER * 2]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position-z={0.001}>
        <planeBufferGeometry args={[width, height]} />
        <meshStandardMaterial color="#20C20E" />
      </mesh>
      <group name="content" position-z={0.002}>
        {children}
      </group>
    </group>
  );
}
