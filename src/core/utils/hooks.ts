import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { EnvironmentState, EnvironmentEvent, PlayerRef } from "../";
import { useProgress } from "@react-three/drei";

export const environmentStateContext = createContext<EnvironmentState>(
  {} as EnvironmentState
);

export function useEnvironment(): EnvironmentState {
  return useContext(environmentStateContext);
}

export function useEnvironmentState(): EnvironmentState {
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
  const TIMEOUT = 750;

  const { progress, total } = useProgress();

  const startTime = useRef(new Date());
  const controlledProgress = useRef(0);
  useEffect(() => {
    const newTime = new Date();
    const timeElapsed = newTime.getTime() - startTime.current.getTime();
    const diff = Math.min(
      progress - controlledProgress.current,
      timeElapsed < TIMEOUT ? 99 : 100
    );
    if (diff > 0) {
      controlledProgress.current = progress;
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
