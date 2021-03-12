import { ProviderProps } from "@react-three/cannon/dist/Provider";
import { ContainerProps } from "react-three-fiber/targets/shared/web/ResizeContainer";
import { PlayerRef } from "./player";
import { MutableRefObject, ReactNode } from "react";
import { AssetUrls } from "./loading";

export enum Environment {
  STANDARD,
  KEYFRAME,
  PORTAL,
}

export type EnvironmentProps = {
  children: ReactNode;
  assets?: AssetUrls;
  canvasProps?: Partial<ContainerProps>;
  physicsProps?: Partial<ProviderProps>;
};

export interface EnvironmentState {
  device: DeviceState;
  setDevice: (d: Device) => void;
  type: Environment;
  paused: boolean;
  player: PlayerRef;
  overlay: string | null;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  container: HTMLDivElement | null;
  events: EnvironmentEvent[];
  setPlayer: (p: PlayerRef) => void;
  setPaused: (p: boolean, overlay?: string) => void;
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
