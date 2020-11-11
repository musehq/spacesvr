import { usePlane } from "@react-three/cannon";

type InfinitePlaneProps = {
  height: number;
  size?: [number, number];
  visible?: boolean;
};

export const InfinitePlane = (props: InfinitePlaneProps) => {
  const { height, size = [100, 100], visible } = props;

  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, height, 0],
    args: size,
    type: "Static",
  }));

  return (
    <mesh ref={ref}>
      {visible && (
        <>
          <planeBufferGeometry attach="geometry" args={size} />
          <meshPhongMaterial attach="material" color="#660000" />
        </>
      )}
    </mesh>
  );
};
