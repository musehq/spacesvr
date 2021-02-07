import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Environment,
  EnvironmentEvent,
  EnvironmentState,
  PlayerRef,
  PortalEnvironmentState,
  KeyframeEnvironmentState,
  Device,
} from "../types";
import { useProgress } from "@react-three/drei";
import { isMobile } from "react-device-detect";

export const environmentStateContext = createContext<EnvironmentState>(
  {} as EnvironmentState
);

export function useEnvironment<T extends EnvironmentState>(): T {
  return useContext(environmentStateContext) as T & EnvironmentState;
}

export function usePortalEnvironment(): PortalEnvironmentState {
  return useEnvironment<PortalEnvironmentState>();
}

export function useKeyframeEnvironment(): KeyframeEnvironmentState {
  return useEnvironment<KeyframeEnvironmentState>();
}

export function useEnvironmentState(): EnvironmentState {
  const [device, setDevice] = useState<Device>(isMobile ? "mobile" : "desktop");
  const [paused, setPausedState] = useState(true);
  const [overlay, setOverlayState] = useState(null);
  const container = useRef<HTMLDivElement>(null);
  const events = useRef<EnvironmentEvent[]>([]);
  const player = useRef<PlayerRef>({} as PlayerRef);

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

  const setPlayer = (p: PlayerRef) => {
    player.current = p;
  };

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

  const context: EnvironmentState = {
    device,
    setDevice,
    type: Environment.STANDARD,
    paused,
    overlay,
    player: player.current,
    containerRef: container,
    container: container.current,
    events: events.current,
    setPaused,
    setPlayer,
    addEvent,
  };

  return context;
}

export const useControlledProgress = () => {
  const TIMEOUT = 750; // minimum time to wait before moving to 100
  const AFTER_TIME = 100; // extra time to prevent bouncing at reaching 100
  const STUCK_TIMEOUT = 5500; // for safari, when stuck at a value above 50

  const { progress, total } = useProgress();

  const startTime = useRef(new Date());
  const controlledProgress = useRef(0);
  const finished = useRef(false);
  const [, setForceRender] = useState(0);

  useEffect(() => {
    const newTime = new Date();
    const timeElapsed = newTime.getTime() - startTime.current.getTime();
    const diff = Math.min(
      progress - controlledProgress.current,
      timeElapsed < TIMEOUT ? 99 : 100
    );
    if (diff > 0) {
      if (progress === 100) {
        finished.current = true;
        // if progress 100, check in AFTER_TIME ms to make sure it hasn't
        // bounced back down
        setTimeout(() => {
          if (finished.current) {
            controlledProgress.current = progress;
            // set state to force re render
            setForceRender(Math.random());
          }
        }, AFTER_TIME);
      } else {
        finished.current = false;
        controlledProgress.current = progress;

        // once above 50, skip progress is stuck then skip loading
        if (progress > 50) {
          setTimeout(() => {
            if (controlledProgress.current === progress) {
              setSkip(true);
            }
          }, STUCK_TIMEOUT);
        }
      }
    }
  }, [progress]);

  // wait TIMEOUT (ms) to check if any objects are waiting to be loaded
  const [counter, setCounter] = useState(0);
  const [skip, setSkip] = useState(false);
  useEffect(() => {
    if (total > 0) {
      return;
    } else if (counter > 0) {
      setSkip(true);
    } else {
      setTimeout(() => setCounter(counter + 1), TIMEOUT);
    }
  }, [counter]);

  return skip ? 100 : Math.floor(controlledProgress.current);
};

/**
 * Check validity of browser to run 3d experiences,
 * Automatically blacklists Facebook & Instagram in-app
 * browsers
 *
 * @param keywords
 */
export const useValidBrowser = (keywords?: string[]) => {
  const [valid, setValid] = useState(true);

  const INVALID_KEYWORDS = ["FBAN", "FBAV", "Instagram"].concat(keywords || []);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || "";
    const valid = INVALID_KEYWORDS.filter((val) => ua.includes(val));
    setValid(valid.length === 0);
  }, []);

  return valid;
};
