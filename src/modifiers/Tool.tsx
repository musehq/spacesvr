import React, { ReactNode, useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { Camera, Group, Vector3 } from "three";
import { useSpring } from "react-spring";
import { getSpringValues } from "../core/utils/spring";
import { useEnvironment } from "../core";

type Props = {
  children: ReactNode;
  pos?: [number, number];
  face?: boolean;
  distance?: number;
};

const SCALE = 0.0025;
const DISTANCE = 0.05;

/**
 * Tool modifier will place its children in constant view of the camera
 *
 * pos will determine relative placement on [x, y] axis
 * face will make item face the player (defaults to true)
 *
 * @param props
 * @constructor
 */
export const Tool = (props: Props) => {
  const { children, pos, face = true, distance = DISTANCE } = props;

  const { camera, size, gl } = useThree();
  const { device } = useEnvironment();

  const group = useRef<Group>();
  const parent = useRef<Group>();

  const { current: dummyVector } = useRef(new Vector3());
  const { current: seed } = useRef(Math.random());
  const [t, f] = hashSpringSeed(seed);

  const [spring, setSpring] = useSpring(() => ({
    xyz: [0, 0, 0],
    config: { tension: 120 + t, friction: 24 + f, precision: 0.00001 },
  }));

  useFrame(() => {
    if (!group.current) return;

    const cam: Camera = device.xr ? gl.xr.getCamera(camera) : camera;

    if (pos !== undefined) {
      const xPos = (pos[0] * 0.00008 * size.width) / 2;
      dummyVector.set(xPos, 0.04 * pos[1], -distance);
      const moveQuaternion = cam.quaternion.clone();
      moveQuaternion.x = 0;
      moveQuaternion.z = 0;
      dummyVector.applyQuaternion(moveQuaternion);

      setSpring({ xyz: dummyVector.toArray() });
    }

    if (face) {
      group.current.lookAt(cam.position);
    }

    const [x, y, z] = getSpringValues(spring);
    group.current.position.set(x, y, z);
  });

  useFrame(() => {
    if (parent.current) {
      const cam: Camera = device.xr ? gl.xr.getCamera(camera) : camera;
      parent.current.position.copy(cam.position);
    }
  }, 1);

  return (
    <group ref={parent}>
      <group ref={group} scale={[SCALE, SCALE, SCALE]}>
        {children}
      </group>
    </group>
  );
};

const hashSpringSeed = (seed: number): [number, number] => {
  const t = (((seed * 100) % 100) - 50) / 50;
  const f = (((seed * 10000) % 100) - 50) / 50;
  return [t * 40, f * 13];
};
