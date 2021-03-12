import { ReactNode } from "react";
import { ProviderProps } from "@react-three/cannon/dist/Provider";
import { ContainerProps } from "react-three-fiber/targets/shared/web/ResizeContainer";

export type EnvironmentProps = {
  children: ReactNode;
  canvasProps?: Partial<ContainerProps>;
  physicsProps?: Partial<ProviderProps>;
};

export interface EnvironmentState {
  progress: number;
  device: DeviceState;
  setDevice: (d: Device) => void;
  pointerLocked: boolean;
  setPointerLocked: (l: boolean) => void;
  overlay: string | null;
  setOverlay: (o: string) => void;
  container: HTMLDivElement | null;
  setContainer: (c: HTMLDivElement | null) => void;
}

export type Device = "desktop" | "mobile" | "xr";

export type DeviceState = {
  xr: boolean;
  mobile: boolean;
  desktop: boolean;
};
