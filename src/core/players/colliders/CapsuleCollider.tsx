import { ShapeType, useCompoundBody } from "@react-three/cannon";
import { Vector3 } from "three";

type CapsuleColliderProps = {
  initPos?: Vector3;
};

// height of 1
const RADIUS = 0.2;
const HEIGHT = 0.6;

const SHAPE_TYPE: ShapeType = "Sphere";
const sphereProps = { type: SHAPE_TYPE, args: [RADIUS] };
const sphere1 = { ...sphereProps, position: [0, HEIGHT / 3, 0] };
const sphere2 = { ...sphereProps, position: [0, HEIGHT / 2, 0] };
const sphere3 = {
  ...sphereProps,
  position: [0, (HEIGHT * 2) / 3, 0],
};

export const useCapsuleCollider = (props: CapsuleColliderProps) => {
  const { initPos = new Vector3(0, 1, 0) } = props;

  const compoundBody = useCompoundBody(() => ({
    mass: 0,
    position: initPos.toArray(),
    segments: 8,
    friction: 0.3,
    fixedRotation: true,
    type: "Dynamic",
    shapes: [sphere1, sphere2, sphere3],
  }));

  return compoundBody;
};

export const VisibleCapsuleCollider = () => {
  const createSphere = (sphere: any) => (
    <mesh position={sphere.position}>
      <sphereBufferGeometry args={sphere.args} attach="geometry" />
      <meshStandardMaterial color="red" attach="material" wireframe={true} />
    </mesh>
  );

  return (
    <group name="collider" position={[0.5, -HEIGHT, 0]}>
      {createSphere(sphere1)}
      {createSphere(sphere2)}
      {createSphere(sphere3)}
    </group>
  );
};
