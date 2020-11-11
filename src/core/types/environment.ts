import { ProviderProps } from "@react-three/cannon/dist/Provider";
import { ContainerProps } from "react-three-fiber/targets/shared/web/ResizeContainer";
import { PlayerRef } from "./player";
import { MutableRefObject, ReactNode } from "react";
import { Portal } from "./portal";

export type EnvironmentProps = {
  children: ReactNode;
  canvasProps?: Partial<ContainerProps>;
  physicsProps?: Partial<ProviderProps>;
};

export type EnvironmentState = {
  paused: boolean;
  player: PlayerRef;
  overlay: string | null;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  container: HTMLDivElement | null;
  events: EnvironmentEvent[];
  setPlayer: (p: PlayerRef) => void;
  setPaused: (p: boolean, overlay?: string) => void;
  addEvent: (name: string, callback: (...args: any[]) => void) => void;
  portal?: Portal;
};

export interface EnvironmentEvent {
  name: string;
  callback: (...args: any[]) => void;
}
