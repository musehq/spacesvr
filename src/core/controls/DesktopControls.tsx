import { MutableRefObject } from "react";
import { Quaternion, Vector3 } from "three";
import KeyboardMovement from "./KeyboardMovement";
import MouseFPSCamera from "./MouseFPSCamera";

type DesktopControlsProps = {
  direction: MutableRefObject<Vector3>;
  quaternion: MutableRefObject<Quaternion>;
  position: MutableRefObject<Vector3>;
};

const DesktopControls = (props: DesktopControlsProps) => {
  const { direction, quaternion, position } = props;

  return (
    <>
      <KeyboardMovement direction={direction} />
      <MouseFPSCamera quaternion={quaternion} position={position} />
    </>
  );
};

export default DesktopControls;
