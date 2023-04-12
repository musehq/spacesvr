import { Props as ContainerProps } from "@react-three/fiber/dist/declarations/src/web/Canvas";
import { NoToneMapping } from "three";

export const defaultCanvasProps: Partial<ContainerProps> = {
  gl: {
    powerPreference: "high-performance",
    antialias: true,
    depth: true,
    alpha: false,
    stencil: false,
    useLegacyLights: false,
    toneMapping: NoToneMapping,
  },
  shadows: false,
  camera: { position: [0, 2, 0], near: 0.01, far: 300 },
  dpr: 1,
  raycaster: { far: 3 },
  events: undefined,
};
