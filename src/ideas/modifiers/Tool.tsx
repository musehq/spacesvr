import { ReactNode, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Vector3 } from "three";

type Props = {
  children: ReactNode;
  pos?: [number, number];
  face?: boolean;
  distance?: number;
  pinY?: boolean;
  t?: number;
};

const SCALE = 0.0025;

/**
 * Tool modifier will place its children in constant view of the camera
 *
 * pos will determine relative placement on [x, y] axis
 * face will make item face the player (defaults to true)
 *
 * @param props
 * @constructor
 */
export function Tool(props: Props) {
  const {
    children,
    pos,
    face = true,
    pinY = false,
    distance = 1,
    t = 1,
  } = props;

  const DISTANCE = distance * 0.05;

  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  const group = useRef<Group>(null);
  const groupPos = useMemo(() => new Vector3(), []);
  const dummyVec = useMemo(() => new Vector3(), []);
  const slerpVec = useMemo(() => new Vector3(), []);

  useFrame(() => {
    if (!group.current) return;

    if (pos !== undefined) {
      const xPos = (pos[0] * 0.00008 * size.width) / 2;
      const yPos = 0.04 * pos[1];
      dummyVec.set(xPos * distance, yPos * distance, -DISTANCE);
      const moveQuaternion = camera.quaternion.clone();
      if (!pinY) {
        moveQuaternion.x = 0;
        moveQuaternion.z = 0;
      }
      dummyVec.applyQuaternion(moveQuaternion);

      group.current.getWorldPosition(groupPos);
      slerpVec.copy(group.current.position);
      const deltaPos = groupPos.sub(camera.position);
      slerpVec.sub(deltaPos);
      slerpVec.add(dummyVec);
      group.current.position.lerp(slerpVec, t);
    }

    if (face) {
      group.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group name="tool" ref={group}>
      <group scale={SCALE * distance}>{children}</group>
    </group>
  );
}
