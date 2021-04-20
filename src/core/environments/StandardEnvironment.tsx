import styled from "@emotion/styled";
import Crosshair from "../ui/Crosshair";
import { ProviderProps } from "@react-three/cannon/dist/Provider";
import { Physics } from "@react-three/cannon";
import Player, { PlayerProps } from "../players/Player";
import Entities from "../simulated/Entities";
import {
  useEnvironmentState,
  EnvironmentContext,
} from "../contexts/environment";
import { useSimulationState, SimulationContext } from "../contexts/simulation";
import { EnvironmentProps } from "../types/environment";
import { SimulationProps } from "../types/simulation";
import LoadingScreen from "../overlays/LoadingScreen";
import { InfinitePlane } from "../../components/InfinitePlane";
import DesktopPause from "../overlays/DesktopPause";
import GlobalStyles from "../styles/GlobalStyles";
import { ReactNode } from "react";
import { ResizeObserver } from "@juggle/resize-observer";
import { VRCanvas } from "@react-three/xr";
import { isMobile } from "react-device-detect";
import { Props as ContainerProps } from "@react-three/fiber/dist/declarations/src/web/Canvas";
import { AdaptiveDpr } from "@react-three/drei";
import { RegisterMenuItems } from "../utils/menu";

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;

  canvas {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    outline: 0;
  }
`;

const defaultCanvasProps: Partial<ContainerProps> = {
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

const defaultPhysicsProps: Partial<ProviderProps> = {
  size: 50,
  allowSleep: false,
  gravity: [0, -9.8, 0],
  defaultContactMaterial: {
    friction: 0,
  },
};

type StandardEnvironmentProps = {
  playerProps?: PlayerProps;
  pauseMenu?: ReactNode;
  disableGround?: boolean;
  simulationProps?: SimulationProps;
  loadingScreen?: ReactNode;
  adaptiveDPR?: boolean;
};

/**
 *
 * Standard environment should be your first choice for an environment
 *
 * Player Type: First Person w/ WASD, Joystick controls, Gyro Controls
 * Physics: Enabled with default y=0 floor plane
 * Loading Screen & Pause Menu
 *
 */
export const StandardEnvironment = (
  props: EnvironmentProps & StandardEnvironmentProps
) => {
  const {
    children,
    canvasProps,
    physicsProps,
    simulationProps,
    playerProps,
    disableGround,
    pauseMenu,
    loadingScreen,
    adaptiveDPR = true,
  } = props;

  const simState = useSimulationState(simulationProps);
  const envState = useEnvironmentState();

  return (
    <>
      <GlobalStyles />
      <Container ref={envState.containerRef}>
        <VRCanvas {...defaultCanvasProps} {...canvasProps}>
          <Physics {...defaultPhysicsProps} {...physicsProps}>
            <EnvironmentContext.Provider value={envState}>
              <SimulationContext.Provider value={simState}>
                <RegisterMenuItems />
                {adaptiveDPR && <AdaptiveDpr />}
                <Player {...playerProps}>
                  <Entities />
                  {!disableGround && <InfinitePlane height={-0.001} />}
                  {children}
                </Player>
              </SimulationContext.Provider>
            </EnvironmentContext.Provider>
          </Physics>
        </VRCanvas>
        <EnvironmentContext.Provider value={envState}>
          {loadingScreen || <LoadingScreen />}
          {pauseMenu || <DesktopPause />}
          <Crosshair />
        </EnvironmentContext.Provider>
      </Container>
    </>
  );
};
