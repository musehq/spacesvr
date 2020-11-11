import { MutableRefObject, useRef } from "react";
import { Quaternion, Vector3 } from "three";
import TouchFPSCamera from "./TouchFPSCamera";
import NippleMovement from "./NippleMovement";

type MobileControlsProps = {
  direction: MutableRefObject<Vector3>;
  quaternion: MutableRefObject<Quaternion>;
  position: MutableRefObject<Vector3>;
};

const MobileControls = (props: MobileControlsProps) => {
  const { direction, quaternion, position } = props;

  const nippleContainer = useRef<HTMLElement>(null);

  return (
    <>
      <NippleMovement direction={direction} nippleContainer={nippleContainer} />
      <TouchFPSCamera
        quaternion={quaternion}
        position={position}
        nippleContainer={nippleContainer}
      />
    </>
  );
};

export default MobileControls;
