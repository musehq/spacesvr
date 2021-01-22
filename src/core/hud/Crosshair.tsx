import { Group, Raycaster, Vector3 } from "three";
import { useRef, useState } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { config, useSpring } from "react-spring";
import { getSpringValues } from "../utils/spring";

const DISTANCE = 0.05;
const SCALE = 0.001;

const Crosshair = () => {
  const group = useRef<Group>();

  const dummyVector = useRef(new Vector3());
  const { camera, mouse } = useThree();
  const [raycaster] = useState(new Raycaster());

  const [spring, setSpring] = useSpring(() => ({
    xyz: [0, 0, 0],
    config: { ...config.stiff, precision: 0.0001 },
  }));

  useFrame(() => {
    if (group.current) {
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.at(DISTANCE, dummyVector.current);
      setSpring({ xyz: dummyVector.current.toArray() });

      const [x, y, z] = getSpringValues(spring);
      group.current.position.set(x / SCALE, y / SCALE, z / SCALE);
    }
  });

  return (
    <group scale={[SCALE, SCALE, SCALE]}>
      <group ref={group}>
        <mesh position-z={0.25}>
          <sphereBufferGeometry args={[1, 50, 50]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position-z={-0.25}>
          <sphereBufferGeometry args={[1, 50, 50]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>
    </group>
  );
};

export default Crosshair;
