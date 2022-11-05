import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ToolKey } from "./types/char";
import { isTyping } from "../../logic";
import ToolSwitcher from "./ideas/ToolSwitcher";
import { PerspectiveCamera, Scene } from "three";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import Lights from "./ideas/Lights";

type Tool = {
  name: string;
  key: ToolKey;
  orderIndex?: number;
};

type Direction = "left" | "right" | "up";

type ToolbeltState = {
  tools: Tool[];
  activeTool?: Tool;
  grant: (name: string, key: ToolKey, orderIndex?: number) => void;
  revoke: (name: string) => void;
  hide: () => void;
  next: () => void;
  prev: () => void;
  show: () => void;
  activeIndex: number | undefined;
  setActiveIndex: (i: number) => void;
  hudScene: Scene;
  direction: Direction;
};
export const ToolbeltContext = createContext({} as ToolbeltState);
export const useToolbelt = () => useContext(ToolbeltContext);

type ToolbeltProps = {
  children: ReactNode[] | ReactNode;
};

export default function Toolbelt(props: ToolbeltProps) {
  const { children } = props;

  const [hudScene] = useState(() => new Scene());
  const { camera, scene } = useThree();

  const tools = useMemo<Tool[]>(() => [], []);
  const [activeIndex, setActiveIndex] = useState<number>();
  const lastActiveIndex = useRef(0);

  const [direction, setDirection] = useState<Direction>("right");

  const grant = useCallback(
    (name: string, key: ToolKey, orderIndex?: number) => {
      // make sure no tool with same name or key exists
      if (tools.find((tool) => tool.name === name || tool.key === key)) {
        console.error(`Toolbelt: Tool with same name or key already exists`);
        return;
      }
      const tool = { name, key, orderIndex };
      tools.push(tool);
      tools.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    },
    [tools]
  );

  const revoke = useCallback(
    (name: string) => {
      const tool = tools.find((tool) => tool.name === name);
      if (tool) {
        tools.splice(tools.indexOf(tool), 1);
      }
    },
    [tools]
  );

  useEffect(() => {
    const handleKeypress = (e: KeyboardEvent) => {
      if (isTyping() || e.metaKey || e.ctrlKey) return;
      tools.map((tool, i) => {
        if (e.key === tool.key || e.key.toLowerCase() === tool.key) {
          setActiveIndex(activeIndex === i ? undefined : i);
        }
      });
      if (e.key == "Tab") {
        if (e.shiftKey) {
          setDirection("left");
          if (activeIndex === undefined) setActiveIndex(tools.length - 1);
          else if (activeIndex === 0) setActiveIndex(undefined);
          else setActiveIndex((activeIndex - 1 + tools.length) % tools.length);
        } else {
          setDirection("right");
          if (activeIndex === undefined) setActiveIndex(0);
          else if (activeIndex === tools.length - 1) setActiveIndex(undefined);
          else setActiveIndex((activeIndex + 1) % tools.length);
        }

        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeypress);
    return () => document.removeEventListener("keydown", handleKeypress);
  }, [activeIndex, tools]);

  useEffect(() => {
    if (activeIndex !== undefined) lastActiveIndex.current = activeIndex;
  }, [activeIndex]);

  const next = useCallback(() => {
    setDirection("right");
    setActiveIndex((actInd) =>
      actInd !== undefined ? (actInd + 1) % tools.length : 0
    );
  }, [tools]);

  const prev = useCallback(() => {
    setDirection("left");
    setActiveIndex((actInd) =>
      actInd !== undefined ? (actInd - 1 + tools.length) % tools.length : 0
    );
  }, [tools]);

  const hide = useCallback(() => {
    setActiveIndex(undefined);
  }, []);

  const show = useCallback(() => {
    setDirection("up");
    setActiveIndex(lastActiveIndex.current);
  }, []);

  const value = {
    tools,
    activeTool: activeIndex !== undefined ? tools[activeIndex] : undefined,
    grant,
    revoke,
    hide,
    next,
    prev,
    show,
    activeIndex,
    setActiveIndex,
    hudScene,
    direction,
  };

  // hud render loop, use copied camera to render at 0,0,0
  const [camClone] = useState(() => (camera as PerspectiveCamera).clone());
  useFrame(({ gl }) => {
    const _cam = camera as PerspectiveCamera;
    camClone.position.set(0, 0, 0);
    camClone.quaternion.copy(_cam.quaternion);
    camClone.near = _cam.near;
    camClone.far = _cam.far;
    camClone.aspect = _cam.aspect;
    camClone.fov = _cam.fov;
    camClone.updateProjectionMatrix();

    // for all intents and purposes, the hud items are placed in real world coordinates
    // this is very important for raycasting
    hudScene.position.set(0, 0, 0);
    gl.autoClear = false;
    gl.clearDepth();
    gl.render(hudScene, camClone);
    hudScene.position.copy(camera.position);
    hudScene.updateMatrixWorld(true);
  }, 10);

  // main render loop
  useFrame(({ gl }) => {
    gl.autoClear = true;
    gl.render(scene, camera);
  }, 1);

  return (
    <ToolbeltContext.Provider value={value}>
      <ToolSwitcher />
      {createPortal(<Lights />, hudScene)}
      {children}
    </ToolbeltContext.Provider>
  );
}
