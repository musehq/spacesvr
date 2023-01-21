import { ReactNode, useMemo, useRef } from "react";
import { Euler, Group, Quaternion, Vector2, Vector3 } from "three";
import { useLimitedFrame } from "../../logic/limiter";

type LookAtPlayer = {
  enabled?: boolean;
  children: ReactNode;
};

const DOWN_AXIS = new Vector3(0, -1, 0);

/**
 * Will smoothly rotate its children to face the camera along the Y axis, regardless of the parent's rotation.
 */
export function LookAtPlayer(props: LookAtPlayer) {
  const { enabled = true, children } = props;

  const group = useRef<Group>(null);

  const flatDelta = useMemo(() => new Vector2(), []);
  const worldPos = useMemo(() => new Vector3(), []);
  const worldQuat = useMemo(() => new Quaternion(), []);
  const targetQuat = useMemo(() => new Quaternion(), []);
  const parentQuat = useMemo(() => new Quaternion(), []);
  const offsetRot = useMemo(() => new Euler(), []);

  useLimitedFrame(50, ({ camera }, delta) => {
    if (!group.current) return;

    group.current.parent?.getWorldQuaternion(parentQuat);
    offsetRot.setFromQuaternion(parentQuat, "YXZ");
    targetQuat.set(0, 0, 0, 1);

    if (enabled) {
      group.current.getWorldPosition(worldPos);
      group.current.getWorldQuaternion(worldQuat);
      flatDelta.x = camera.position.x - worldPos.x;
      flatDelta.y = camera.position.z - worldPos.z;

      const angle = flatDelta.angle() - Math.PI / 2 + offsetRot.y;
      targetQuat.setFromAxisAngle(DOWN_AXIS, angle);
    }

    group.current.quaternion.slerp(targetQuat, 0.11);
  });

  return (
    <group name="look-at-player" ref={group}>
      {children}
    </group>
  );
}
