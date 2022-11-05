import { createContext, ReactNode, useContext, useEffect } from "react";

type MemoryState = {
  layers: string[];
};

const MemoryContext = createContext({} as MemoryState);

export const useMemory = (name: string) => {
  const { layers } = useContext(MemoryContext);

  const useLayerDefinition = (name: string) => {
    useEffect(() => {
      if (layers.includes(name)) {
        console.error("Memory: Layer already exists");
        return true;
      }
      layers.push(name);
    }, []);
  };

  useEffect(() => {
    if (layers.includes(name)) {
      console.error("Memory: Layer already exists");
      return true;
    }
    layers.push(name);
  }, []);

  return () => {
    return () => layers.splice(layers.indexOf(name), 1);
  };
};

type MemoryProps = {
  children: ReactNode[] | ReactNode;
};

export default function Memory(props: MemoryProps) {
  return;
}
