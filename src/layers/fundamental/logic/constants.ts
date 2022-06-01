import { Props as ContainerProps } from "@react-three/fiber/dist/declarations/src/web/Canvas";
import { ResizeObserver } from "@juggle/resize-observer";
import { isMobile } from "react-device-detect";
import { ProviderProps } from "@react-three/cannon/dist/Provider";

export const defaultCanvasProps: Partial<ContainerProps> = {
  gl: {
    powerPreference: "high-performance",
    antialias: true,
    depth: true,
    alpha: false,
    stencil: false,
  },
  shadows: false,
  camera: { position: [0, 2, 0], near: 0.01, far: 150 },
  resize: { polyfill: ResizeObserver },
  dpr: 1,
  raycaster: {
    enabled: isMobile,
  },
  // disable default enter vr button
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onCreated: () => {},
};

export const defaultPhysicsProps: Partial<ProviderProps> = {
  size: 50,
  allowSleep: false,
  gravity: [0, -9.8, 0],
  defaultContactMaterial: {
    friction: 0,
  },
};
