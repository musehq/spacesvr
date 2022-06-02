import { ShapeType, Triplet, useCompoundBody } from "@react-three/cannon";
import { useEffect, useState } from "react";
import { useEnvironment } from "../../Environment";

// height of 0.9 (eye level) for a perceived height of 1
const HEIGHT = 0.9;
const RADIUS = HEIGHT / 3;

const SHAPE_TYPE: ShapeType = "Sphere";

const sphereProps = { type: SHAPE_TYPE, args: [RADIUS] };
const sphere1 = { ...sphereProps, position: [0, -(HEIGHT - RADIUS), 0] };
const sphere2 = { ...sphereProps, position: [0, -(HEIGHT / 2), 0] };
const sphere3 = { ...sphereProps, position: [0, -RADIUS, 0] };

export const useCapsuleCollider = (pos = [0, 0, 0]) => {
  const vPos = pos as Triplet;

  const { paused } = useEnvironment();
  const [setup, setSetup] = useState(false);

  const compoundBody = useCompoundBody(() => ({
    mass: 0,
    position: vPos,
    segments: 8,
    fixedRotation: true,
    type: "Dynamic",
    shapes: [sphere1, sphere2, sphere3],
  }));

  useEffect(() => {
    if (!paused && !setup) {
      compoundBody[1].mass?.set(62);
      setSetup(true);
    }
  }, [setup, paused, compoundBody]);

  return compoundBody;
};

export function VisibleCapsuleCollider() {
  const createSphere = (sphere: any) => (
    <mesh position={sphere.position}>
      <sphereBufferGeometry args={sphere.args} attach="geometry" />
      <meshStandardMaterial color="red" attach="material" wireframe={true} />
    </mesh>
  );

  return (
    <group name="collider" position={[1.5, 0, 0]}>
      {createSphere(sphere1)}
      {createSphere(sphere2)}
      {createSphere(sphere3)}
    </group>
  );
}
