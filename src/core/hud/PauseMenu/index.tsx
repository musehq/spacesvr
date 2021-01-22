import { Group, Raycaster, Vector3 } from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { useSpring } from "react-spring";
import { getSpringValues } from "../../utils/spring";
import { Idea } from "../../../components/Idea";
import { Floating } from "../../../modifiers/Floating";
import { Billboard } from "@react-three/drei";
import Menu from "./components/Menu";

const DISTANCE = 0.05;
const SCALE = 0.001;

const PauseMenu = () => {
  const group = useRef<Group>();

  const [open, setOpen] = useState(true);
  const dummyVector = useRef(new Vector3());
  const { camera, mouse } = useThree();
  const [raycaster] = useState(new Raycaster());

  const [spring, setSpring] = useSpring(() => ({
    xyz: [0, 0, 0],
    config: { tension: 800, friction: 35, precision: 0.0001 },
  }));

  useFrame(() => {
    if (!group.current) return;

    raycaster.setFromCamera({ x: -0.8, y: -0.7 }, camera);
    raycaster.ray.at(DISTANCE, dummyVector.current);
    setSpring({ xyz: dummyVector.current.toArray() });

    const [x, y, z] = getSpringValues(spring);
    group.current.position.set(x / SCALE, y / SCALE, z / SCALE);
  });

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() == "l") {
      setOpen(!open);
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", onKeyPress);
    return () => {
      window.removeEventListener("keypress", onKeyPress);
    };
  }, [open]);

  return (
    <group scale={[SCALE, SCALE, SCALE]}>
      <group ref={group}>
        <Floating height={1}>
          {open && (
            <group>
              <Idea size={2} />
              <Billboard args={[0, 0]}>
                <Menu position-x={2} />
              </Billboard>
            </group>
          )}
        </Floating>
      </group>
    </group>
  );
};

export default PauseMenu;
