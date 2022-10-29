import { Props as ContainerProps } from "@react-three/fiber/dist/declarations/src/web/Canvas";
import { ResizeObserver } from "@juggle/resize-observer";

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
  raycaster: { far: 2 },
  events: undefined,
};
