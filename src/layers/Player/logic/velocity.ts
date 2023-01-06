import { useMemo, useRef, useState } from "react";
import { Camera, Group, MathUtils, Quaternion, Vector3 } from "three";
import { Api } from "@react-three/cannon";
import { useEnvironment } from "../../Environment";
import { useThree } from "@react-three/fiber";

export const useSpringVelocity = (bodyApi: Api<Group>[1], speed: number) => {
  const direction = useRef(new Vector3());
  const { device } = useEnvironment();
  const dummy = useMemo(() => new Vector3(), []);

  const [quat] = useState(new Quaternion());
  const targetYVel = useRef(0);

  const clock = useThree((state) => state.clock);
  const lastvelocity = useRef(new Vector3());
  const lastTime = useRef(0);
  const y_accel = useRef(0);
  const [dumdum] = useState(new Vector3());

  const updateVelocity = (cam: Camera, velocity: Vector3) => {
    dumdum.x = velocity.x || 0;
    dumdum.y = 0;
    dumdum.z = velocity.z || 0;
    const vel = dumdum.length() / speed;

    const y_change = (velocity.y || 0) - lastvelocity.current.y;
    const elapsedTime = clock.getElapsedTime();
    const delta = Math.abs(elapsedTime - lastTime.current);
    y_accel.current = MathUtils.lerp(
      y_accel.current,
      y_change / delta || 0, // i think this is the bad one!!! (for all the || 0's)
      0.1
    );

    // get forward/back movement and left/right movement velocities
    dummy.x = (direction.current.x || 0) * 0.75;
    dummy.z = direction.current.z || 0; // forward/back
    dummy.y = 0;
    dummy.multiplyScalar(speed + Math.abs(y_accel.current) * 0.085);

    quat.copy(cam.quaternion);
    quat.x = 0;
    quat.z = 0;
    dummy.applyQuaternion(quat);

    // calc y velocity
    targetYVel.current = MathUtils.lerp(
      targetYVel.current,
      (direction.current.y || 0) * 0.6,
      0.05 + vel * 0.075
    );
    dummy.y = Math.min((velocity.y || 0) + targetYVel.current, 4 + vel);

    // keep y velocity intact and update velocity
    if (!device.desktop) {
      bodyApi.velocity.set(dummy.x, dummy.y, dummy.z);
      lastvelocity.current.set(dummy.x, dummy.y, dummy.z);
    } else {
      const newX = MathUtils.lerp(velocity.x || 0, dummy.x, 0.25);
      const newZ = MathUtils.lerp(velocity.z || 0, dummy.z, 0.25);
      bodyApi.velocity.set(newX, dummy.y, newZ);
      lastvelocity.current.set(newX, dummy.y, newZ);
    }

    lastTime.current = elapsedTime;
  };

  return {
    direction,
    updateVelocity,
  };
};
