import { createContext, ReactNode, useContext, useState } from "react";
import { config, useSpring } from "react-spring";

type WorldSwitcherProps = {
  children: ReactNode | ReactNode[];
};

type WorldSwitcherState = {
  current: number;
  setCurrent: (n: number) => void;
};

const WorldSwitcherContext = createContext({} as WorldSwitcherState);

export function useWorldSwitcher() {
  return useContext(WorldSwitcherContext);
}

// https://discourse.threejs.org/t/layers-in-single-scene-vs-muliple-scenes-vs-multiple-canvas/19701/2
export default function WorldSwitcher(props: WorldSwitcherProps) {
  const { children } = props;

  const [current, setCurrent] = useState(0);

  //TODO: change on url change
  const { zero, one, two } = useSpring({
    zero: current === 0 ? 1 : 0,
    one: current === 1 ? 1 : 0,
    two: current === 2 ? 1 : 0,
    config: config.molasses,
  });

  return (
    <WorldSwitcherContext.Provider value={{ current, setCurrent }}>
      {children}
    </WorldSwitcherContext.Provider>
  );
}
