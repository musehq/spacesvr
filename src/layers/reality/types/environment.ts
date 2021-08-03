import { ProviderProps } from "@react-three/cannon/dist/Provider";
import { MutableRefObject, ReactNode } from "react";
import { Props as ContainerProps } from "@react-three/fiber/dist/declarations/src/web/Canvas";

export type EnvironmentProps = {
  children: ReactNode;
  canvasProps?: Partial<ContainerProps>;
  physicsProps?: Partial<ProviderProps>;
};

export interface EnvironmentState {
  paused: boolean;
  device: DeviceState;
  setDevice: (d: Device) => void;
  setPaused: (p: boolean, overlay?: string) => void;
  overlay: string | null;
  container: HTMLDivElement | null;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  menuItems: MenuItem[];
  setMenuItems: (i: MenuItem[]) => void;
  events: EnvironmentEvent[];
  addEvent: (name: string, callback: (...args: any[]) => void) => void;
}

export interface EnvironmentEvent {
  name: string;
  callback: (...args: any[]) => void;
}

export type Device = "desktop" | "mobile" | "xr";

export type DeviceState = {
  xr: boolean;
  mobile: boolean;
  desktop: boolean;
};

export type MenuItem = { text: string; action: () => void };
