import {
  createContext,
  MutableRefObject,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { MenuItem } from "./menu";
import { Device, DeviceState, useDevice } from "./device";

export type PauseEvent = (p: boolean) => void;
export type EnvironmentState = {
  paused: boolean;
  name: string;
  setPaused: (p: boolean) => void;
  events: PauseEvent[];
  device: DeviceState;
  setDevice: (d: Device) => void;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  menuItems: MenuItem[];
  setMenuItems: (i: MenuItem[]) => void;
};
export const EnvironmentContext = createContext({} as EnvironmentState);
export const useEnvironment = () => useContext(EnvironmentContext);

export const useEnvironmentState = (name: string): EnvironmentState => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const container = useRef<HTMLDivElement>(null);
  const [paused, setPausedValue] = useState(true);
  const events = useMemo<PauseEvent[]>(() => [], []);

  const setPaused = (p: boolean) => {
    setPausedValue(p);
    // call all pause events
    events.map((ev: PauseEvent) => ev.apply(null, [p]));
  };

  const device = useDevice();

  return {
    ...device,
    name,
    paused,
    setPaused,
    events,
    containerRef: container,
    menuItems,
    setMenuItems,
  };
};
