import { usePlane } from "@react-three/cannon";

type InfinitePlaneProps = {
  height?: number;
  size?: [number, number];
  visible?: boolean;
};

export function InfinitePlane(props: InfinitePlaneProps) {
  const { height = -0.0001, size = [100, 100], visible } = props;

  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, height, 0],
    args: size,
    type: "Static",
  }));

  if (!visible) return null;

  return (
    <mesh name="spacesvr-infinite-plane" ref={ref}>
      <planeBufferGeometry attach="geometry" args={size} />
      <meshPhongMaterial attach="material" color="#660000" />
    </mesh>
  );
}
