import {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";
import { Effects } from "./modifiers/Effects";
import { useFrame, useThree } from "@react-three/fiber";
import { useRerender } from "../../logic/rerender";

type Pass = { uuid: string; node: ReactElement; index: number };

type VisualState = {
  registerPass: (p: Pass) => void;
  unregisterPass: (uuid: string) => void;
};
export const VisualContext = createContext({} as VisualState);
export const useVisual = () => useContext(VisualContext);

type VisualLayerProps = { children: ReactNode[] | ReactNode };

export default function Visual(props: VisualLayerProps) {
  const { children } = props;
  const { scene, camera, gl } = useThree();

  const childPasses = useRef<Pass[]>([]);
  const rerender = useRerender();

  const registerPass = useCallback((p: Pass) => {
    childPasses.current.push(p);
    childPasses.current.sort((a, b) => a.index - b.index);
    rerender();
  }, []);

  const unregisterPass = useCallback((uuid: string) => {
    childPasses.current = childPasses.current.filter((p) => p.uuid !== uuid);
    rerender();
  }, []);

  useFrame(() => {
    if (childPasses.current.length > 0) return;
    gl.autoClear = true;
    gl.render(scene, camera);
  }, 1);

  return (
    <VisualContext.Provider value={{ registerPass, unregisterPass }}>
      {childPasses.current.length > 0 && (
        <Effects>{childPasses.current.map((p) => p.node)}</Effects>
      )}
      {children}
    </VisualContext.Provider>
  );
}
