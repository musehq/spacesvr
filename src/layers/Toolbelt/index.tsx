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

type Tool = {
  name: string;
  key: ToolKey;
};

type ToolbeltState = {
  activeTool?: Tool;
  grant: (name: string, key: ToolKey) => void;
  revoke: (name: string) => void;
};
export const ToolbeltContext = createContext({} as ToolbeltState);
export const useToolbelt = () => useContext(ToolbeltContext);

type ToolbeltProps = {
  children: ReactNode[] | ReactNode;
};

export default function Toolbelt(props: ToolbeltProps) {
  const { children } = props;

  const tools = useMemo<Tool[]>(() => [], []);
  const [activeToolName, setActiveToolName] = useState<string>();

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
      tools.map((tool) => {
        if (e.key === tool.key || e.key.toLowerCase() === tool.key) {
          if (activeToolName === tool.name) {
            setActiveToolName(undefined);
          } else {
            setActiveToolName(tool.name);
          }
        }
      });
    };
    document.addEventListener("keydown", handleKeypress);
    return () => document.removeEventListener("keydown", handleKeypress);
  }, [activeToolName, tools]);

  const value = {
    activeTool: tools.find((tool) => tool.name === activeToolName),
    grant,
    revoke,
  };

  return (
    <ToolbeltContext.Provider value={value}>
      {children}
    </ToolbeltContext.Provider>
  );
}
