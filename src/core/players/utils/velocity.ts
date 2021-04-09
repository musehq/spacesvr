import { useRef } from "react";
import { Camera, Vector3 } from "three";
import { Api } from "@react-three/cannon";
import { useSpring } from "react-spring";
import { getSpringValues } from "../../utils/spring";

export const useSpringVelocity = (bodyApi: Api[1], speed: number) => {
  const direction = useRef(new Vector3());

  const [spring, setSpring] = useSpring(() => ({
    xyz: [0, 0, 0],
    config: { tension: 200, friction: 26, precision: 0.0001 },
  }));

  const updateVelocity = (cam: Camera, velocity: Vector3) => {
    // get forward/back movement and left/right movement velocities
    const inputVelocity = new Vector3(0, 0, 0);
    inputVelocity.x = direction.current.x * 0.75;
    inputVelocity.z = direction.current.y; // forward/back
    inputVelocity.multiplyScalar(speed);

    const moveQuaternion = cam.quaternion.clone();
    moveQuaternion.x = 0;
    moveQuaternion.z = 0;
    inputVelocity.applyQuaternion(moveQuaternion);
    inputVelocity.y = Math.min(velocity.y, 0);

    // keep y velocity intact and update velocity
    setSpring({ xyz: inputVelocity.toArray() });
    const [x, y, z] = getSpringValues(spring);
    bodyApi.velocity.set(x, y, z);
  };

  return {
    direction,
    updateVelocity,
  };
};
