import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Scene } from "three";
import { useRerender } from "../../../logic";

type Tool = {
  name: string;
  orderIndex: number;
  icon?: string;
};

type Direction = "left" | "right" | "up";

type ToolbeltState = {
  tools: Tool[];
  activeTool?: Tool;
  grant: (name: string, icon?: string, orderIndex?: number) => void;
  revoke: (name: string) => void;
  hide: () => void;
  next: () => void;
  prev: () => void;
  show: () => void;
  activeIndex: number | undefined;
  setActiveIndex: (i: number | undefined) => void;
  setActiveTool: (name: string) => void;
  hudScene: Scene;
  direction: Direction;
  setDirection: (dir: Direction) => void;
};
export const ToolbeltContext = createContext({} as ToolbeltState);
export const useToolbelt = () => useContext(ToolbeltContext);

export const useToolbeltState = (showOnSpawn: boolean): ToolbeltState => {
  const [hudScene] = useState(() => new Scene());
  const rerender = useRerender();

  const tools = useMemo<Tool[]>(() => [], []);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(
    showOnSpawn ? 0 : undefined
  );
  const lastActiveIndex = useRef(0);

  const [direction, setDirection] = useState<Direction>("right");

  const grant = useCallback(
    (name: string, icon?: string, orderIndex?: number) => {
      // make sure no tool with same name or key exists
      if (tools.find((tool) => tool.name === name)) {
        console.error(`Toolbelt: Tool with same name already exists: ${name}`);
        return;
      }
      if (tools.length === 0) rerender();
      const tool = { name, icon, orderIndex: orderIndex || 0 };
      tools.push(tool);
      // sort tools by orderIndex, then by name
      tools.sort((a, b) =>
        a.orderIndex !== b.orderIndex
          ? a.orderIndex - b.orderIndex
          : a.name.localeCompare(b.name)
      );
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
    if (activeIndex !== undefined) lastActiveIndex.current = activeIndex;
  }, [activeIndex]);

  const next = useCallback(() => {
    setDirection("right");
    if (tools.length === 1) {
      setActiveIndex((actInd) => (actInd === undefined ? 0 : undefined));
    } else {
      setActiveIndex((actInd) =>
        actInd !== undefined ? (actInd + 1) % tools.length : 0
      );
    }
  }, [tools]);

  const prev = useCallback(() => {
    setDirection("left");
    if (tools.length === 1) {
      setActiveIndex((actInd) => (actInd === undefined ? 0 : undefined));
    } else {
      setActiveIndex((actInd) =>
        actInd !== undefined ? (actInd - 1 + tools.length) % tools.length : 0
      );
    }
  }, [tools]);

  const hide = useCallback(() => {
    setActiveIndex(undefined);
  }, []);

  const show = useCallback(() => {
    setActiveIndex((oldInd) =>
      oldInd === undefined ? lastActiveIndex.current : oldInd
    );
  }, []);

  const setActiveTool = useCallback(
    (name: string) => {
      const index = tools.findIndex((tool) => tool.name === name);
      if (index !== -1) setActiveIndex(index);
    },
    [tools]
  );

  return {
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
    setActiveTool,
    hudScene,
    direction,
    setDirection,
  };
};
