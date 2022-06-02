import { useMemo, useRef } from "react";
import { Camera, MathUtils, Vector3 } from "three";
import { Api } from "@react-three/cannon";
import { useEnvironment } from "../../Environment";

export const useSpringVelocity = (bodyApi: Api[1], speed: number) => {
  const direction = useRef(new Vector3());
  const { device } = useEnvironment();
  const dummy = useMemo(() => new Vector3(), []);

  const updateVelocity = (cam: Camera, velocity: Vector3) => {
    // get forward/back movement and left/right movement velocities
    dummy.x = direction.current.x * 0.75;
    dummy.z = direction.current.y; // forward/back
    dummy.multiplyScalar(speed);

    const moveQuaternion = cam.quaternion.clone();
    moveQuaternion.x = 0;
    moveQuaternion.z = 0;
    dummy.applyQuaternion(moveQuaternion);
    dummy.y = velocity.y;

    // keep y velocity intact and update velocity
    if (!device.desktop) {
      bodyApi.velocity.set(dummy.x, dummy.y, dummy.z);
    } else {
      const newX = MathUtils.lerp(velocity.x, dummy.x, 0.25);
      const newZ = MathUtils.lerp(velocity.z, dummy.z, 0.25);
      bodyApi.velocity.set(newX, dummy.y, newZ);
    }
  };

  return {
    direction,
    updateVelocity,
  };
};
