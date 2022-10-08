import { ShapeType, Triplet, useCompoundBody } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { useEnvironment } from "../../Environment";
import { Group } from "three";

// height of 0.9 (eye level) for a perceived height of 1
const HEIGHT = 0.9;
const RADIUS = 0.2;
const SEGMENTS = 12;

const SPHERE_SHAPE: ShapeType = "Sphere";
const CYLINDER_SHAPE: ShapeType = "Cylinder";

const sphereProps = { type: SPHERE_SHAPE, args: [RADIUS, SEGMENTS, SEGMENTS] };
const cylinderProps = {
  type: CYLINDER_SHAPE,
  args: [RADIUS, RADIUS, HEIGHT - RADIUS * 2, SEGMENTS],
};

const sphere1 = { ...sphereProps, position: [0, -(HEIGHT - RADIUS), 0] };
const cylinder = { ...cylinderProps, position: [0, -(HEIGHT / 2), 0] };
const sphere2 = { ...sphereProps, position: [0, -RADIUS, 0] };

export const useCapsuleCollider = (pos = [0, 0, 0]) => {
  const vPos = useRef(pos as Triplet);

  const { paused } = useEnvironment();

  const compoundBody = useCompoundBody<Group>(
    () => ({
      mass: 0,
      position: vPos.current,
      segments: SEGMENTS,
      fixedRotation: true,
      type: "Dynamic",
      shapes: [sphere1, cylinder, sphere2],
    }),
    undefined,
    []
  );

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

  const createCylinder = (cylinder: any) => (
    <mesh position={cylinder.position}>
      <cylinderBufferGeometry args={cylinder.args} />
      <meshStandardMaterial color="blue" wireframe={true} />
    </mesh>
  );

  return (
    <group name="collider" position={[1.5, -HEIGHT, 0]}>
      {createSphere(sphere1)}
      {createCylinder(cylinder)}
      {createSphere(sphere2)}
    </group>
  );
}
