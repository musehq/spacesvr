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

  const DISTANCE = distance * 0.05;
  const SCALE = 0.0025;

  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  const group = useRef<Group>(null);
  const worldPos = useMemo(() => new Vector3(), []);
  const locPos = useMemo(() => new Vector3(), []);
  const dummyQuat = useMemo(() => new Quaternion(), []);
  const slerpVec = useMemo(() => new Vector3(), []);
  const lastLocPos = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    if (!group.current) return;

    if (pos !== undefined) {
      const xPos = (pos[0] * 0.00008 * size.width) / 2;
      const yPos = 0.04 * pos[1];
      locPos.set(xPos * distance, yPos * distance, -DISTANCE);
      dummyQuat.copy(camera.quaternion);
      if (!pinY) {
        dummyQuat.x = 0;
        dummyQuat.z = 0;
      }
      locPos.applyQuaternion(dummyQuat);
      slerpVec.copy(lastLocPos);
      slerpVec.lerp(locPos, 1 - Math.pow(t, delta));
      lastLocPos.copy(slerpVec);
      locPos.copy(slerpVec);

      group.current.getWorldPosition(worldPos);
      slerpVec.copy(group.current.position);
      const deltaPos = worldPos.sub(camera.position);
      slerpVec.sub(deltaPos);
      slerpVec.add(locPos);
      group.current.position.copy(slerpVec);
    }

    if (face) {
      group.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group name="hud" ref={group}>
      <group scale={SCALE * distance}>{children}</group>
    </group>
  );
}
