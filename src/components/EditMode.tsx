import {
  ReactNode,
  useMemo,
  useRef,
  useState,
  createContext,
  useContext,
  useEffect,
} from "react";
import { Interactable, RangeTool } from "../modifiers";
import { usePlayer } from "../core/contexts";
import { Group, Intersection, Object3D, Raycaster, Vector3 } from "three";
import { animated, useSpring } from "react-spring/three";
import { useThree } from "@react-three/fiber";
import { ControlManager } from "./BuilderTools";
import { Editor } from "./BuilderTools/types/types";
import { isMobile } from "react-device-detect";
import { AltRangeTool } from "./BuilderTools/modifiers/AltRangeTool";

type EditProps = {
  children: ReactNode;
  editDist?: number;
};

const EditorContext = createContext<Editor>({} as Editor);
export function useEditor() {
  return useContext(EditorContext);
}

function getIdea(object: Object3D): string | null {
  if (object.name.includes("idea") || object.name === "Editor") {
    return object.name;
  } else if (object.parent) {
    return getIdea(object.parent);
  } else {
    return null;
  }
}

export function EditMode(props: EditProps) {
  const { children, editDist = 15 } = props;
  const { raycaster } = usePlayer();
  const group = useRef<Group>();
  const editor = useRef<Group>();
  const contactPoint = useRef<Vector3 | null>(null);
  const {
    gl: { domElement },
  } = useThree();
  const [edit, setEdit] = useState<string>("");
  const [mouseDown, setMouseDown] = useState<string>("");
  const intersection = useRef<Intersection>();
  const object = useMemo(() => {
    if (group.current) {
      return group.current.getObjectByName(edit);
    }
  }, [edit]);

  const { scale } = useSpring({
    scale: edit !== "" ? 20 : 0,
    config: {
      mass: 1,
    },
  });

  const onMouseUp = (e: MouseEvent | TouchEvent) => {
    setMouseDown("");
  };

  function handleClick(raycaster: Raycaster) {
    if (!group.current) return;

    let idea: string | null;
    if (intersection.current) {
      idea = getIdea(intersection.current.object);
      if (idea === "Editor") {
        idea = edit;
      }
    } else {
      idea = null;
    }
    contactPoint.current = intersection.current
      ? intersection.current.point
      : null;

    if (idea && idea !== "") {
      setEdit(idea);
    } else {
      setEdit("");
    }
  }

  function handleMouseDown(raycaster: Raycaster) {
    if (!group.current) return;

    intersection.current = raycaster.intersectObject(group.current, true)[0];
    const idea = intersection.current
      ? getIdea(intersection.current.object)
      : "";
    contactPoint.current = intersection.current
      ? intersection.current.point
      : null;

    if (idea && idea !== "") {
      setMouseDown(idea);
      if (isMobile) {
        domElement.addEventListener("touchend", onMouseUp);
      } else {
        domElement.addEventListener("mouseup", onMouseUp);
      }
    } else {
      setMouseDown("none");
    }
  }

  useEffect(() => {
    if (mouseDown === "") {
      if (isMobile) {
        domElement.removeEventListener("touchend", onMouseUp);
      } else {
        domElement.removeEventListener("mouseup", onMouseUp);
      }
    }
  }, [mouseDown]);

  return (
    <EditorContext.Provider
      value={{
        editObject: object,
        editor: editor.current,
        mouseDown: mouseDown,
        intersection: contactPoint.current,
      }}
    >
      <Interactable
        editDist={editDist}
        onDownClick={() => {
          handleMouseDown(raycaster);
        }}
        onClick={() => {
          handleClick(raycaster);
        }}
      >
        <group ref={group} name="scene">
          {children}
          <AltRangeTool
            edit={edit}
            editor={editor.current}
            pos={[0, -0.5]}
            distance={5}
            range={1}
            t={0.025}
          >
            {/*<RangeTool pos={[0, -0.5]} distance={3} range={0.75} t={0.025}>*/}
            <animated.group
              rotation-x={-0.25}
              scale={scale}
              ref={editor}
              name="Editor"
            >
              {/*<mesh>*/}
              {/*  <boxBufferGeometry args={[1, 0.25, 0.1]} />*/}
              {/*  <meshBasicMaterial color="white" />*/}
              {/*</mesh>*/}
              {/*<group name="selectedObject" position={[-0.4, 0.1, 0.06]}>*/}
              {/*  <Text fontSize={0.035} color="black" textAlign="left">*/}
              {/*    Selected:*/}
              {/*  </Text>*/}
              {/*  <Text*/}
              {/*    fontSize={0.035}*/}
              {/*    color="red"*/}
              {/*    textAlign="left"*/}
              {/*    position-x={0.125}*/}
              {/*  >*/}
              {/*    {edit}*/}
              {/*  </Text>*/}
              {/*</group>*/}
              <ControlManager />
            </animated.group>
          </AltRangeTool>
        </group>
      </Interactable>
    </EditorContext.Provider>
  );
}
