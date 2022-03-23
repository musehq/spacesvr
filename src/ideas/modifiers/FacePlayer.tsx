import { ReactNode, useRef } from "react";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";
import { useLimiter } from "../../utils/limiter";

type FacePlayerProps = {
  children: ReactNode | ReactNode[];
  lockX?: boolean;
  lockY?: boolean;
  lockZ?: boolean;
};

export function FacePlayer(props: FacePlayerProps) {
  const { children, lockX = false, lockY = false, lockZ = false } = props;

  const group = useRef<Group>();
  const limiter = useLimiter(45);

  useFrame(({ clock, camera }) => {
    if (!limiter.isReady(clock)) return;

    if (group.current) {
      const prev = {
        x: group.current.rotation.x,
        y: group.current.rotation.y,
        z: group.current.rotation.z,
      };
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
