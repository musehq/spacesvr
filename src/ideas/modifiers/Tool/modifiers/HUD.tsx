import { ReactNode, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Quaternion } from "three";

type HUDProps = {
  children?: ReactNode | ReactNode[];
  pos?: [number, number];
  face?: boolean;
  distance?: number;
  pinY?: boolean;
  t?: number;
};

/**
 * Place the children in front of the camera
 * @param props
 * @constructor
 */
export default function HUD(props: HUDProps) {
  const {
    children,
    pos = [0, 0],
    face = true,
    pinY = false,
    distance = 1,
    t = 1,
  } = props;

  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  const group = useRef<Group>(null);
  const quat = useMemo(() => new Quaternion(), []);

  useFrame((_, delta) => {
    if (!group.current) return;

    // screen space
    const x = pos[0] * 0.00008 * size.width * 0.5;
    const y = pos[1] * 0.04;
    group.current.position.set(x * distance, y * distance, -distance);

    // rotate to match camera angle, slerp rotation
    quat.slerp(camera.quaternion, 1 - Math.pow(t * 0.0005 * size.width, delta));
    if (!pinY) {
      quat.x = 0;
      quat.z = 0;
    }
    group.current.position.applyQuaternion(quat);

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
