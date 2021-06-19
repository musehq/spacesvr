import { ReactNode, useMemo, useRef, useState } from "react";
import { Interactable, RangeTool } from "../modifiers";
import { usePlayer } from "../core/contexts";
import { Group, Object3D, Raycaster } from "three";
import { animated, useSpring } from "react-spring/three";
import { useLimiter } from "../services";
import { useFrame } from "@react-three/fiber";
import { ControlManager } from "./BuilderTools";

type EditProps = {
  children: ReactNode;
  editDist?: number;
};

function getIdea(object: Object3D): string {
  if (object.name.includes("idea") || object.name.includes("editor")) {
    return object.name;
  } else if (object.parent) {
    return getIdea(object.parent);
  } else {
    return "";
  }
}

export function EditMode(props: EditProps) {
  const { children, editDist = 15 } = props;
  const { raycaster } = usePlayer();
  const group = useRef<Group>();
  const [edit, setEdit] = useState<string>("");
  const object = useMemo(() => {
    if (group.current) {
      return group.current.getObjectByName(edit);
    }
  }, [edit]);

  console.log(edit);
  const { scale } = useSpring({
    scale: edit === "" ? 0 : 20,
    config: {
      mass: 1,
    },
  });

  function handleClick(raycaster: Raycaster) {
    if (!group.current) return;

    const object = raycaster.intersectObject(group.current, true)[0].object;
    const idea = getIdea(object);

    // console.log(edit);
    if (idea !== "") {
      setEdit(idea);
    } else {
      setEdit("");
    }
  }

  const limiter = useLimiter(45);
  useFrame(({ clock }) => {
    if (!limiter.isReady(clock) || !object) return;
    // console.log(scale.getValue())
    // console.log(object);
  });

  return (
    <group>
      <Interactable
        editDist={editDist}
        onClick={() => {
          handleClick(raycaster);
        }}
      >
        <group ref={group} name="scene">
          {children}
          <RangeTool pos={[0, -0.5]} distance={3} range={0.005} t={0.005}>
            <animated.group rotation-x={-0.25} scale={scale} name="editor">
              <mesh>
                <boxBufferGeometry args={[1, 0.25, 0.1]} />
                <meshBasicMaterial color="white" />
              </mesh>
              <ControlManager object={object} />
            </animated.group>
          </RangeTool>
        </group>
      </Interactable>
    </group>
  );
}
