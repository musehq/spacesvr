import { ReactNode, useMemo, useRef } from "react";
import { Group, Quaternion, Vector2, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useLimiter } from "../../logic/limiter";

type Props = {
  enabled?: boolean;
  children: ReactNode;
};

const AXIS = new Vector3(0, 1, 0);

export default function LookAtPlayer(props: Props) {
  const { enabled = true, children } = props;

  const group = useRef<Group>();
  const limiter = useLimiter(50);
  const dummy1 = useMemo(() => new Vector2(), []);
  const dummy2 = useMemo(() => new Vector2(), []);
  const dummy3 = useMemo(() => new Vector3(), []);
  const dummy4 = useMemo(() => new Quaternion().setFromAxisAngle(AXIS, 0), []);

  useFrame(({ clock, camera }, delta) => {
    if (!limiter.isReady(clock)) return;

    if (group.current) {
      let rot = 0;

      if (enabled) {
        group.current.getWorldPosition(dummy3);
        dummy1.set(dummy3.x, dummy3.z);
        dummy2.set(camera.position.x, camera.position.z);
        dummy1.sub(dummy2);

        rot = -dummy1.normalize().angle();
        if (rot < 0) {
          rot += Math.PI * 2;
        }
      }

      dummy4.setFromAxisAngle(AXIS, rot);

      group.current.quaternion.slerp(dummy4, delta * 10);
    }
  });

  return <group ref={group}>{children}</group>;
}
