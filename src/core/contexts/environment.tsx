import { createContext, useContext, useState } from "react";
import { Device, EnvironmentState, KeyframeEnvironmentState } from "../types";
import { isMobile } from "react-device-detect";
import { useControlledProgress } from "../utils/loading";

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
  const [device, setDevice] = useState<Device>(isMobile ? "mobile" : "desktop");
  const deviceState = {
    mobile: device === "mobile",
    desktop: device === "desktop",
    xr: device === "xr",
  };

  const [pointerLocked, setPointerLocked] = useState(false);
  const [overlay, setOverlay] = useState<string | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const progress = useControlledProgress();

  const context: EnvironmentState = {
    progress,
    device: deviceState,
    setDevice,
    pointerLocked,
    setPointerLocked,
    overlay,
    setOverlay,
    container,
    setContainer,
  };

  return context;
}
