import { Group, Raycaster, Vector2, Vector3 } from "three";
import { useRef, useState } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { useSpring } from "react-spring";
import { getSpringValues } from "../utils/spring";
import { isMobile } from "react-device-detect";
import { useEnvironment } from "../contexts/environment";

const DISTANCE = 0.05;
const SCALE = 0.001;
const CENTER_VECTOR = new Vector2();

const Crosshair = () => {
  const group = useRef<Group>();
  const parent = useRef<Group>();

  const { camera, mouse } = useThree();
  const { pointerLocked } = useEnvironment();
  const dummyVector = useRef(new Vector3());
  const [raycaster] = useState(new Raycaster());

  const [spring, setSpring] = useSpring(() => ({
    xyz: [0, 0, 0],
    config: { tension: 220 * 40, friction: 21 * 40, precision: 0.001 },
  }));

  useFrame(() => {
    if (!isMobile && group.current) {
      raycaster.setFromCamera(pointerLocked ? CENTER_VECTOR : mouse, camera);
      raycaster.ray.at(DISTANCE, dummyVector.current);
      dummyVector.current.sub(camera.position);
      setSpring({ xyz: dummyVector.current.toArray() });

      const [x, y, z] = getSpringValues(spring);
      group.current.position.set(x / SCALE, y / SCALE, z / SCALE);
    }
  });

  useFrame(() => {
    if (parent.current) {
      parent.current.position.copy(camera.position);
    }
  }, 1);

  if (isMobile) {
    return null;
  }

  return (
    <group ref={parent} scale={[SCALE, SCALE, SCALE]}>
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
