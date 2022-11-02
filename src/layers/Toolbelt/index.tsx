import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ToolKey } from "./types/char";
import { isTyping } from "../../logic";
import ToolSwitcher from "./modifiers/ToolSwitcher";
import { PerspectiveCamera, Scene } from "three";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import Lights from "./ideas/Lights";

type Tool = {
  name: string;
  key: ToolKey;
};

type ToolbeltState = {
  tools: Tool[];
  activeTool?: Tool;
  grant: (name: string, key: ToolKey) => void;
  revoke: (name: string) => void;
  hide: () => void;
  setActiveIndex: (i: number) => void;
  hudScene: Scene;
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

  const grant = useCallback(
    (name: string, key: ToolKey) => {
      // make sure no tool with same name or key exists
      if (tools.find((tool) => tool.name === name || tool.key === key)) {
        console.error(`Toolbelt: Tool with same name or key already exists`);
        return;
      }
      const tool = { name, key };
      tools.push(tool);
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
        setActiveIndex(
          activeIndex === undefined ? 0 : (activeIndex + 1) % tools.length
        );
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeypress);
    return () => document.removeEventListener("keydown", handleKeypress);
  }, [activeIndex, tools]);

  const value = {
    tools,
    activeTool: activeIndex !== undefined ? tools[activeIndex] : undefined,
    grant,
    revoke,
    hide: () => setActiveIndex(undefined),
    setActiveIndex,
    hudScene,
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
