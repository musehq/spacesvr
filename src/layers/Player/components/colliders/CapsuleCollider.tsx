import { ShapeType, Triplet, useCompoundBody } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { useEnvironment } from "../../../Environment";
import { Group } from "three";

// height of 0.9 (eye level) for a perceived height of 1
const HEIGHT = 0.9;
const RADIUS = 0.2;
const SEGMENTS = 10;

const SPHERE_SHAPE: ShapeType = "Sphere";

const sphereProps = { type: SPHERE_SHAPE, args: [RADIUS, SEGMENTS, SEGMENTS] };

const topSphere = { ...sphereProps, position: [0, -RADIUS, 0] };
const middleSphere = { ...sphereProps, position: [0, -(HEIGHT / 2), 0] };
const bottomSphere = { ...sphereProps, position: [0, -(HEIGHT - RADIUS), 0] };

export const useCapsuleCollider = (pos = [0, 0, 0]) => {
  const vPos = useRef(pos as Triplet);

  const { paused } = useEnvironment();

  const compoundBody = useCompoundBody<Group>(() => ({
    mass: 0,
    position: vPos.current,
    segments: SEGMENTS,
    fixedRotation: true,
    type: "Dynamic",
    shapes: [topSphere, middleSphere, bottomSphere],
  }));

  useEffect(() => {
    if (!paused) compoundBody[1].mass.set(62);
  }, [paused, compoundBody]);

  return compoundBody;
};

export function VisibleCapsuleCollider() {
  const createSphere = (sphere: any) => (
    <mesh position={sphere.position}>
      <sphereBufferGeometry args={sphere.args} />
      <meshStandardMaterial color="red" wireframe={true} />
    </mesh>
  );

  return (
    <group name="collider" position={[1.5, -HEIGHT, 0]}>
      {createSphere(topSphere)}
      {createSphere(middleSphere)}
      {createSphere(bottomSphere)}
    </group>
  );
}
