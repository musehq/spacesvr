import { Group, Raycaster, Vector3 } from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "react-three-fiber";
import { useSpring } from "react-spring";
import { getSpringValues } from "../../utils/spring";
import { Idea } from "../../../components/Idea";
import { Floating } from "../../../modifiers/Floating";
import { Billboard } from "@react-three/drei";
import Menu from "./components/Menu";
import { FacePlayer } from "../../../modifiers/FacePlayer";

const DISTANCE = 0.05;
const SCALE = 0.001;

const PauseMenu = () => {
  const group = useRef<Group>();

  const [open, setOpen] = useState(true);
  const dummyVector = useRef(new Vector3());
  const { camera, mouse } = useThree();
  const [raycaster] = useState(new Raycaster());

  const [spring, setSpring] = useSpring(() => ({
    xyzab: [0, 0, 0, 0, 0],
    config: { tension: 800, friction: 35, precision: 0.0001 },
  }));

  useFrame(() => {
    if (!group.current) return;

    const [x, y, z, a, b] = getSpringValues(spring);

    raycaster.setFromCamera({ x: a, y: b }, camera);
    raycaster.ray.at(DISTANCE, dummyVector.current);

    const newAB = open ? [-0.8, 0.7] : [-0.8 * 6, 0.7 * 6];
    dummyVector.current.y += open ? 0 : 0.1;

    setSpring({ xyzab: [...dummyVector.current.toArray(), ...newAB] });

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
          <group>
            <Idea size={2} />
            <FacePlayer>
              <Menu position-x={2} position-y={-2} />
            </FacePlayer>
          </group>
        </Floating>
      </group>
    </group>
  );
};

export default PauseMenu;
