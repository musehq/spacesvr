import { Group, Raycaster, Vector3 } from "three";
import { useRef, useState } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { config, useSpring } from "react-spring";
import { getSpringValues } from "../utils/spring";

const DISTANCE = 0.05;

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
      group.current.position.set(x, y, z);
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereBufferGeometry args={[0.001, 50, 50]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  );
};

export default Crosshair;
