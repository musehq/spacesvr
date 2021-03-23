import { ProviderProps } from "@react-three/cannon/dist/Provider";
import { ContainerProps } from "react-three-fiber/targets/shared/web/ResizeContainer";
import { PlayerRef } from "./player";
import { MutableRefObject, ReactNode } from "react";
import { SimulationState } from "./simulation";
import { SimulationProps } from "../utils/simulation";
import { AssetUrls } from "./loading";

export enum Environment {
  STANDARD,
  KEYFRAME,
  PORTAL,
}

export type EnvironmentStateProps = {
  simulation?: SimulationState;
};

export type EnvironmentProps = {
  children: ReactNode;
  assets?: AssetUrls;
  canvasProps?: Partial<ContainerProps>;
  physicsProps?: Partial<ProviderProps>;
  simulationProps?: SimulationProps;
};

export interface EnvironmentState {
  type: Environment;
  paused: boolean;
  setPaused: (p: boolean, overlay?: string) => void;
  overlay: string | null;
  container: HTMLDivElement | null;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  events: EnvironmentEvent[];
  player: PlayerRef;
  setPlayer: (p: PlayerRef) => void;
  simulation: SimulationState;
  addEvent: (name: string, callback: (...args: any[]) => void) => void;
}

export interface EnvironmentEvent {
  name: string;
  callback: (...args: any[]) => void;
}
