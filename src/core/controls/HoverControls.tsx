import { useFrame, useThree } from "react-three-fiber";

type HoverControlsProps = {
  center: [number, number, number];
  xDist?: number;
  yDist?: number;
};

const HoverControls = (props: HoverControlsProps) => {
  const { center = [0, 0, 0], xDist = 3, yDist = 1.5 } = props;

  const { camera } = useThree();

  useFrame(({ mouse }) => {
    const xOffset = -mouse.x * xDist;
    const yOffset = -mouse.y * yDist;
    camera.position.set(center[0] + xOffset, center[1] + yOffset, center[2]);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

export default HoverControls;
