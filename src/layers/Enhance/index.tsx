import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";
import { EffectComposer } from "@react-three/postprocessing";

type Pass = { node: ReactNode; index: number };

type EnhanceState = {
  createEnhancePortal(node: ReactNode, index: number): null;
};
export const EnhanceContext = createContext({} as EnhanceState);
export const EnhanceProvider = EnhanceContext.Provider;

export const useEnhance = () => useContext(EnhanceContext);

type EnhanceLayer = { children: ReactNode[] | ReactNode };

export default function Enhance(props: EnhanceLayer) {
  const { children } = props;

  const passes = useRef<Pass[]>([]);

  const createEnhancePortal = useCallback((node: ReactNode, index: number) => {
    passes.current.push({ node, index });
    passes.current.sort((a, b) => a.index - b.index);
    return null;
  }, []);

  return (
    <EnhanceProvider value={{ createEnhancePortal }}>
      <EffectComposer>
        {passes.current.map((pass) => (
          <>{pass.node}</>
        ))}
      </EffectComposer>
      {children}
    </EnhanceProvider>
  );
}
