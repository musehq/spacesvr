import {
  createContext,
  MutableRefObject,
  useContext,
  useRef,
  useState,
} from "react";
import { MenuItem } from "./menu";
import { Device, DeviceState, useDevice } from "./device";

export interface EnvironmentState {
  paused: boolean;
  setPaused: (p: boolean, overlay?: string) => void;
  device: DeviceState;
  setDevice: (d: Device) => void;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  menuItems: MenuItem[];
  setMenuItems: (i: MenuItem[]) => void;
}
export const EnvironmentContext = createContext({} as EnvironmentState);
export const useEnvironment = () => useContext(EnvironmentContext);

export const useEnvironmentState = (): EnvironmentState => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const container = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(true);

  const device = useDevice();

  return {
    ...device,
    paused,
    setPaused,
    containerRef: container,
    menuItems,
    setMenuItems,
  };
};
