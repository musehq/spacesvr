import {
  createContext,
  MutableRefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Device, DeviceState, useDevice } from "./device";
import { AudioContext } from "three";

interface MenuLink {
  text: string;
  link: string;
  action?: never;
}
interface MenuAction {
  text: string;
  link?: never;
  action: () => void;
}
export type MenuItem = MenuLink | MenuAction;

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

  const [played, setPlayed] = useState(false);

  const setPaused = useCallback(
    (p: boolean) => {
      setPausedValue(p);

      // hook into paused click event to make sure global context is running.
      // https://github.com/mrdoob/three.js/blob/342946c8392639028da439b6dc0597e58209c696/src/audio/AudioContext.js#L9
      // local state to only do once so we don't interfere with MuteOnHide
      if (!played) {
        const context = AudioContext.getContext();
        if (context.state !== "running") context.resume();
        setPlayed(true);
      }

      // call all pause events
      events.map((ev: PauseEvent) => ev.apply(null, [p]));
    },
    [events, played]
  );

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
