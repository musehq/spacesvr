import { ReactNode, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, PerspectiveCamera, Quaternion, Vector2 } from "three";
import { getHudPos } from "../logic/screen";

type HUDProps = {
  children?: ReactNode | ReactNode[];
  pos: [number, number];
  distance: number;
  pinY?: boolean;
  t?: number;
  range: number;
};

/**
 * Place the children in front of the camera
 * @param props
 * @constructor
 */
export default function HUD(props: HUDProps) {
  const { children, pos, pinY = false, distance, t = 1, range } = props;

  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  const group = useRef<Group>(null);
  const quat = useMemo(() => new Quaternion(), []);
  const [lerpPos] = useState(new Vector2().fromArray(pos));
  const [lerpedQuat] = useState(new Quaternion());

  useFrame((_, delta) => {
    if (!group.current) return;

    const alpha = 1 - Math.pow(t * 0.0005 * size.width, delta);

    lerpPos.lerp(new Vector2().fromArray(pos), alpha);

    // calculate x position based on camera and screen width
    const { x, y } = getHudPos(
      lerpPos.toArray(),
      camera as PerspectiveCamera,
      distance
    );
    group.current.position.set(x, y, -distance);

    // rotate to match camera angle, slerp rotation
    const RANGE_SET = range > 0;
    quat.copy(camera.quaternion);
    if (!RANGE_SET || (RANGE_SET && lerpedQuat.angleTo(quat) > range)) {
      lerpedQuat.slerp(quat, alpha);
    }
    if (!pinY) {
      lerpedQuat.x = 0;
      lerpedQuat.z = 0;
    }

    group.current.position.applyQuaternion(lerpedQuat);

    // needed to that children positions are applied in screen space
    // should probably be moved to draggable .. ? idk, maybe the supposition is that children of hud are in screen space
    group.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group name="hud" ref={group}>
      {children}
    </group>
  );
}
