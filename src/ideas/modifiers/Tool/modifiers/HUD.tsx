import { ReactNode, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, PerspectiveCamera, Quaternion, Vector2 } from "three";
import { getHudPos } from "../../../../logic/hud";
import { useSpring } from "@react-spring/three";

type HUDProps = {
  children?: ReactNode | ReactNode[];
  pos: [number, number];
  distance: number;
  pinY?: boolean;
  range?: number;
};

/**
 * Place the children in front of the camera
 * @param props
 * @constructor
 */
export default function HUD(props: HUDProps) {
  const { children, pos, pinY = false, distance, range = 0 } = props;

  const t = 0.01;

  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  const [spring, set] = useSpring(() => ({ quat: [0, 0, 0, 0] }));

  const group = useRef<Group>(null);
  const [vecPos] = useState(new Vector2());
  const [lerpPos] = useState(new Vector2().fromArray(pos));
  const [lerpedQuat] = useState(new Quaternion());
  const [dummy1] = useState(new Quaternion());
  const [dummy2] = useState(new Quaternion());

  useFrame((_, delta) => {
    if (!group.current) return;

    const alpha = 1 - Math.pow(t * 0.0005 * size.width, delta);

    vecPos.fromArray(pos);
    lerpPos.lerp(vecPos, alpha);

    // calculate x position based on camera and screen width
    const { x, y } = getHudPos(lerpPos, camera as PerspectiveCamera, distance);
    group.current.position.set(x, y, -distance);

    const RANGE_SET = range > 0;

    if (!RANGE_SET) {
      set({ quat: camera.quaternion.toArray() });
    } else {
      // find angle along y axis
      dummy1.copy(lerpedQuat);
      dummy1.x = 0;
      dummy1.z = 0;
      dummy1.normalize();
      dummy2.copy(camera.quaternion);
      dummy2.x = 0;
      dummy2.z = 0;
      dummy2.normalize();
      const angle = dummy1.angleTo(dummy2);

      if (angle > range) {
        const diff = angle - range;
        lerpedQuat.rotateTowards(camera.quaternion, diff);
        if (!pinY) {
          lerpedQuat.x = 0;
          lerpedQuat.z = 0;
          lerpedQuat.normalize();
        }
        set({ quat: lerpedQuat.toArray() });
      }
    }

    lerpedQuat.fromArray(spring.quat.get());
    if (!pinY) {
      lerpedQuat.x = 0;
      lerpedQuat.z = 0;
    }
    group.current.position.applyQuaternion(lerpedQuat);

    // needed so that children positions are applied in screen space
    // should probably be moved to draggable .. ? idk, maybe the supposition is that children of hud are in screen space
    group.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group name="spacesvr-hud" ref={group}>
      {children}
    </group>
  );
}
