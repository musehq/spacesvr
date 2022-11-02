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
import { Scene } from "three";
import { useFrame, useThree } from "@react-three/fiber";

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

  useFrame(
    ({ gl }) =>
      void ((gl.autoClear = false),
      gl.clearDepth(),
      gl.render(hudScene, camera)),
    10
  );
  useFrame(
    ({ gl }) => void ((gl.autoClear = true), gl.render(scene, camera)),
    1
  );

  return (
    <ToolbeltContext.Provider value={value}>
      <ToolSwitcher />
      {children}
    </ToolbeltContext.Provider>
  );
}
