import { useFrame, useThree } from "react-three-fiber";
import { Vector2, Vector3 } from "three";

type Props = {
  speed?: number;
  start?: [number, number, number];
};

const SENSITIVITY = new Vector2(1, 1);

const FlyControls = (props: Props) => {
  const { start = [0, 0, 0], speed = 1 } = props;

  const { camera } = useThree();

  useFrame(({ mouse, clock }, delta) => {
    camera.rotation.y += delta * SENSITIVITY.x * mouse.x;
    camera.rotation.z += delta * SENSITIVITY.y * mouse.y;
    camera.position
      .fromArray(start)
      .add(new Vector3(0, 0, clock.getElapsedTime() * speed * 0.5));
  });

  return null;
};

export default FlyControls;
