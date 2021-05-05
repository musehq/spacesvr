import { usePlane, useBox } from "@react-three/cannon";

export const Ramp = (props) => {
  const { height = 0, size = [100, 100], visible } = props;

  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2 + 0.4, 0, 0],
    position: [0, height, 0],
    args: size,
    type: "Static",
  }));

  return (
    <mesh ref={ref}>
      <planeBufferGeometry attach="geometry" args={size} />
      <meshPhongMaterial attach="material" color="#660000" />
    </mesh>
  );
};

export const Block = () => {
  const size = [0.2, 0.2, 0.2];

  const [ref] = useBox(() => ({
    position: [0, 0.1, 1],
    args: size,
    type: "Static",
  }));

  return (
    <mesh ref={ref}>
      <boxBufferGeometry attach="geometry" args={size} />
      <meshPhongMaterial attach="material" color="#660000" />
    </mesh>
  );
};
