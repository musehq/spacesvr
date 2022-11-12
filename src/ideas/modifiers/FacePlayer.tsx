import { ReactNode, useRef, useState } from "react";
import { useLimitedFrame } from "../../logic/limiter";
import { Euler, Group } from "three";

type FacePlayerProps = {
  children: ReactNode | ReactNode[];
  enabled?: boolean;
  lockX?: boolean;
  lockY?: boolean;
  lockZ?: boolean;
};

export function FacePlayer(props: FacePlayerProps) {
  const {
    children,
    enabled = true,
    lockX = false,
    lockY = false,
    lockZ = false,
  } = props;

  const group = useRef<Group>(null);
  const [prev] = useState(new Euler());

  useLimitedFrame(50, ({ camera }) => {
    if (!group.current) return;

    if (!enabled) {
      group.current.rotation.set(0, 0, 0);
    } else {
      prev.copy(group.current.rotation);
      group.current.lookAt(camera.position);
      if (lockX) group.current.rotation.x = prev.x;
      if (lockY) group.current.rotation.y = prev.y;
      if (lockZ) group.current.rotation.z = prev.z;
    }
  });

  return (
    <group name="spacesvr-faceplayer" ref={group}>
      {children}
    </group>
  );
}
