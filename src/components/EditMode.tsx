import {
  ReactNode,
  useMemo,
  useRef,
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { Interactable, RangeTool } from "../modifiers";
import { usePlayer } from "../core/contexts";
import { Group, Object3D, Raycaster, Vector3 } from "three";
import { animated, useSpring } from "react-spring/three";
import { useFrame, useThree } from "@react-three/fiber";
import { ControlManager } from "./BuilderTools";
import { Editor } from "./BuilderTools/types/types";
import { isMobile } from "react-device-detect";

type EditProps = {
  children: ReactNode;
  editDist?: number;
};

const EditorContext = createContext<Editor>({} as Editor);
export function useEditor() {
  return useContext(EditorContext);
}

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
  const {
    gl: { domElement },
  } = useThree();
  const [edit, setEdit] = useState<string>("");
  const [mouseDown, setMouseDown] = useState<boolean>(false);
  const [contactPoint, setContactPoint] = useState<Vector3>();
  const object = useMemo(() => {
    if (group.current) {
      return group.current.getObjectByName(edit);
    }
  }, [edit]);

  const { scale } = useSpring({
    scale: edit === "" ? 0 : 20,
    config: {
      mass: 1,
    },
  });

  const onMouseUp = (e: MouseEvent | TouchEvent) => {
    setMouseDown(false);
  };

  function handleMouseDown(raycaster: Raycaster) {
    if (!group.current) return;

    const { object } = raycaster.intersectObject(group.current, true)[0];
    const idea = getIdea(object);

    if (idea !== "") {
      setEdit(idea);
      setMouseDown(true);
      if (isMobile) {
        domElement.addEventListener("touchstart", onMouseUp);
      } else {
        domElement.addEventListener("mouseup", onMouseUp);
      }
    } else {
      setEdit("");
    }
  }

  useFrame(() => {
    if (!group.current) return;
    if (raycaster.intersectObject(group.current).length > 0) {
      const { point } = raycaster.intersectObject(group.current, true)[0];
      setContactPoint(point);
    }
  });

  useEffect(() => {
    if (edit === "") {
      if (isMobile) {
        domElement.removeEventListener("touchend", onMouseUp);
      } else {
        domElement.removeEventListener("mouseup", onMouseUp);
      }
    }
  }, [edit]);

  return (
    <EditorContext.Provider
      value={{
        editObject: object,
        mouseDown: mouseDown,
        intersect: contactPoint,
      }}
    >
      <Interactable
        editDist={editDist}
        onDownClick={() => {
          handleMouseDown(raycaster);
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
              <ControlManager />
            </animated.group>
          </RangeTool>
        </group>
      </Interactable>
    </EditorContext.Provider>
  );
}
