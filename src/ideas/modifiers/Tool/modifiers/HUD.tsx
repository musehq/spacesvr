import { ReactNode, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Euler,
  Group,
  MathUtils,
  PerspectiveCamera,
  Quaternion,
  Vector2,
} from "three";
import { getHudPos } from "../../../../logic/hud";
import { QuaterionSpring } from "../logic/quat";
import { config, useSpring } from "@react-spring/three";
import { usePlayer } from "../../../../layers/Player/";

type HUDProps = {
  children?: ReactNode | ReactNode[];
  pos: [number, number];
  distance: number;
  pinY?: boolean;
  range?: number;
  bobStrength?: number;
};

/**
 * Place the children in front of the camera with some sway
 * 1. I tried springing the quaternion, but it's not continuous and causes a jump
 * 2. I found a continuous quaternion spring, but it was not tight enough https://gist.github.com/sketchpunk/3568150a04b973430dfe8fd29bf470c8
 * 3. solution was to move tool in screen spacing by springing pos value offsets based on rotation velocity
 *    springed quat rotation still used for range
 *
 * @param props
 * @constructor
 */
export default function HUD(props: HUDProps) {
  const {
    children,
    pos,
    pinY = false,
    distance,
    range = 0,
    bobStrength,
  } = props;

  const { velocity } = usePlayer();

  const t = 0.0001;

  const group = useRef<Group>(null);
  const [targetPos] = useState(new Vector2());
  const [lerpedPos] = useState(new Vector2().fromArray(pos));
  const [lerpedQuat] = useState(new Quaternion());
  const [targetQuat] = useState(new Quaternion());
  const [lastQuat] = useState(new Quaternion());
  const [lastEuler] = useState(new Euler(0, 0, 0, "YXZ"));
  const [thisEuler] = useState(new Euler(0, 0, 0, "YXZ"));
  const [dummy1] = useState(new Quaternion());
  const [dummy2] = useState(new Quaternion());
  const [hud] = useState(new Vector2());

  const [spring, set] = useSpring(() => ({
    offset: [0, 0],
    config: config.stiff,
  }));

  const qs = useMemo(() => new QuaterionSpring(50, 100), []);

  useFrame(({ camera, clock }, delta) => {
    if (!group.current) return;

    const alpha = 1 - Math.pow(t, delta);

    // apply passes pos and offset pos
    const off = spring.offset.get();
    targetPos.fromArray(pos);
    targetPos.x += off[0] || 0;
    targetPos.y += off[1] || 0;
    lerpedPos.lerp(targetPos, alpha);

    // calculate x position based on camera and screen width
    getHudPos(lerpedPos, camera as PerspectiveCamera, distance, hud);
    group.current.position.set(hud.x, hud.y, -distance);

    // calculate rotation velocities about the respective ROTATION axis (not screen space)
    dummy1.copy(lastQuat);
    dummy2.copy(camera.quaternion);
    thisEuler.setFromQuaternion(camera.quaternion);
    let y_axis_vel = dummy1.multiply(dummy2.invert()).y / (delta || 0.00001);
    let x_axis_vel = (thisEuler.x - lastEuler.x) / (delta || 0.00001);

    // implement range
    const RANGE_SET = range > 0;
    if (!RANGE_SET) {
      lerpedQuat.copy(camera.quaternion);
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

      // if out of range, move it back
      if (angle > range) {
        const diff = angle - range;
        targetQuat.copy(lerpedQuat);
        targetQuat.rotateTowards(camera.quaternion, diff);
        if (!pinY) {
          targetQuat.x = 0;
          targetQuat.z = 0;
          targetQuat.normalize();
        }
      } else {
        // disable offsets if moving camera within range
        x_axis_vel = 0;
        y_axis_vel = 0;
      }
      qs.criticallyStep(lerpedQuat, targetQuat, delta);
    }

    // bob a bit based on player velocity
    const vel_len = velocity.get().length() > 1 ? 1 : 0;
    const strength = bobStrength || Math.max(lerpedPos.length(), 0.05);
    x_axis_vel += Math.sin(clock.elapsedTime * 15) * vel_len * 0.2 * strength;
    y_axis_vel +=
      Math.cos(clock.elapsedTime * 20 + 12) * vel_len * 0.1 * strength;

    // set spring targets based on velocities
    const scale_ang = 0.1;
    const max_ang = 0.3;
    const x_off = MathUtils.clamp(-y_axis_vel * scale_ang, -max_ang, max_ang);
    const y_off = MathUtils.clamp(-x_axis_vel * scale_ang, -max_ang, max_ang);
    set({ offset: [x_off, y_off] });

    // range dependent, move items to camera quat
    group.current.position.applyQuaternion(lerpedQuat);

    // needed so that children positions are applied in screen space
    // should probably be moved to draggable .. ? idk, maybe the supposition is that children of hud are in screen space
    group.current.quaternion.copy(camera.quaternion);

    // update last values
    lastQuat.copy(camera.quaternion);
    lastEuler.setFromQuaternion(camera.quaternion);
  });

  return (
    <group name="spacesvr-hud" ref={group}>
      {children}
    </group>
  );
}
