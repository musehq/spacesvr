import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import {
  Device,
  EnvironmentEvent,
  EnvironmentState,
  KeyframeEnvironmentState,
  MenuItem,
} from "../types";
import { isMobile } from "react-device-detect";

export const EnvironmentContext = createContext<EnvironmentState>(
  {} as EnvironmentState
);

export function useEnvironment<T extends EnvironmentState>(): T {
  return useContext(EnvironmentContext) as T & EnvironmentState;
}

export function useKeyframeEnvironment(): KeyframeEnvironmentState {
  return useEnvironment<KeyframeEnvironmentState>();
}

/**
 * Environment State hook, offered separately from provider since underlying value
 * is used in 2 separate places. Should be used once per environment.
 *
 */
export function useEnvironmentState(): EnvironmentState {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [device, setDevice] = useState<Device>(isMobile ? "mobile" : "desktop");
  const [paused, setPausedState] = useState(true);
  const [overlay, setOverlayState] = useState(null);
  const container = useRef<HTMLDivElement>(null);
  const events = useRef<EnvironmentEvent[]>([]);

  const setPaused = useCallback(
    (p, o) => {
      setPausedState(p);

      if (!p) {
        // if unpausing, set paused overlay to undefined by default
        setOverlayState(o || null);
      }

      if (p && o) {
        // if pausing, only set closed overlay if passed ins
        setOverlayState(o);
      }

      events.current.map((ev: EnvironmentEvent) => {
        if (ev.name === "paused") {
          ev.callback.apply(null, [p, o]);
        }
      });
    },
    [events]
  );

  const addEvent = useCallback(
    (name: string, callback: (...args: any[]) => void) => {
      const event: EnvironmentEvent = {
        name,
        callback,
      };

      events.current.push(event);
    },
    []
  );

  const deviceState = {
    mobile: device === "mobile",
    desktop: device === "desktop",
    xr: device === "xr",
  };

  const context: EnvironmentState = {
    device: deviceState,
    setDevice,
    paused,
    overlay,
    containerRef: container,
    container: container.current,
    events: events.current,
    menuItems,
    setMenuItems,
    setPaused,
    addEvent,
  };

  return context;
}
