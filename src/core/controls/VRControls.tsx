import { useXR } from "@react-three/xr";
import { MutableRefObject, useEffect } from "react";
import { Group, Quaternion, Vector3 } from "three";

import VRControllerMovement from "./VRControllerMovement";

type VRControlsProps = {
  direction: MutableRefObject<Vector3>;
  quaternion: MutableRefObject<Quaternion>;
  camParent: MutableRefObject<undefined | Group>;
};

const VRControls = (props: VRControlsProps) => {
  const { direction, quaternion, camParent } = props;

  const { controllers } = useXR();

  // bundle add the controllers to the same object as the camera so it all stays together.
  useEffect(() => {
    const camParentRef = camParent.current;
    if (camParentRef) {
      if (controllers.length > 0)
        controllers.forEach((c) => camParentRef.add(c.grip));
      return () => controllers.forEach((c) => camParentRef.remove(c.grip));
    }
  }, [controllers, camParent]);

  return (
    <>
      <VRControllerMovement
        camParent={camParent}
        direction={direction}
        quaternion={quaternion}
      />
    </>
  );
};

export default VRControls;
