import { ReactNode, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Quaternion, Vector3 } from "three";

type HUDProps = {
  children?: ReactNode | ReactNode[];
  pos?: [number, number];
  face?: boolean;
  distance?: number;
  pinY?: boolean;
  t?: number;
};

export default function HUD(props: HUDProps) {
  const {
    children,
    pos,
    face = true,
    pinY = false,
    distance = 1,
    t = 1,
  } = props;

  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  const group = useRef<Group>(null);
  const worldPos = useMemo(() => new Vector3(), []);
  const camPos = useMemo(() => new Vector3(), []);
  const quat = useMemo(() => new Quaternion(), []);

  useFrame((_, delta) => {
    if (!group.current) return;

    if (pos !== undefined) {
      // screen space
      const x = pos[0] * 0.00008 * size.width * 0.5;
      const y = pos[1] * 0.04;
      camPos.set(x * distance, y * distance, -distance);

      // rotate to match camera angle, slerp rotation
      quat.slerp(camera.quaternion, 1 - Math.pow(t, delta));
      if (!pinY) {
        quat.x = 0;
        quat.z = 0;
      }
      camPos.applyQuaternion(quat);

      // match group position to camera
      group.current.getWorldPosition(worldPos);
      group.current.position.sub(worldPos).add(camera.position).add(camPos);
    }

    if (face) {
      group.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group name="hud" ref={group}>
      {children}
    </group>
  );
}
