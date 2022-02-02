import {
  BodyProps,
  ShapeType,
  Triplet,
  useCompoundBody,
} from "@react-three/cannon";
import { useEffect, useState } from "react";
import { useEnvironment } from "../../layers/environment";

const RADIUS = 0.5;
const SPACING = 0.3;
const SHAPE_TYPE: ShapeType = "Sphere";

const sphereProps = { type: SHAPE_TYPE, args: [RADIUS] };
const spheres: (BodyProps<unknown> & { type: ShapeType })[] = [];

function generateSpheres(count: number, pos: Triplet, height: number) {
  for (let i = 0; i < count; i++) {
    const sphere = {
      ...sphereProps,
      position: [0, -(SPACING * (i + 1)), 0],
    };
    // @ts-ignore
    spheres.push(sphere);
  }
  return spheres;
}

export const useCapsuleCollider = (pos: Triplet = [0, 0, 0], height = 0.9) => {
  const sphereCount = Math.floor(height / SPACING);

  const spheres = generateSpheres(sphereCount, pos, height);

  const vPos = pos as Triplet;

  const { paused } = useEnvironment();
  const [setup, setSetup] = useState(false);

  const compoundBody = useCompoundBody(() => ({
    mass: 0,
    position: vPos,
    segments: 8,
    fixedRotation: true,
    type: "Dynamic",
    shapes: spheres,
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
  const visibleSpheres = [];
  for (const sphere of spheres) {
    if (!sphere) continue;
    visibleSpheres.push(
      // @ts-ignore
      <mesh position={sphere.position}>
        {/* @ts-ignore */}
        <sphereBufferGeometry args={sphere.args} attach="geometry" />
        <meshStandardMaterial color="red" attach="material" wireframe={true} />
      </mesh>
    );
  }

  return (
    <group name="collider" position={[1.5, 0, 0]}>
      {visibleSpheres}
    </group>
  );
}
