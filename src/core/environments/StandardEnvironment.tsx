import BrowserChecker from "../utils/BrowserChecker";
import styled from "@emotion/styled";
import Crosshair from "../ui/Crosshair";
import { ProviderProps } from "@react-three/cannon/dist/Provider";
import { Physics } from "@react-three/cannon";
import { Canvas } from "react-three-fiber";
import { Vector3 } from "three";
import { ContainerProps } from "react-three-fiber/targets/shared/web/ResizeContainer";
import Player from "../players/Player";
import {
  useEnvironmentState,
  environmentStateContext,
  EnvironmentProps,
} from "..";
import LoadingScreen from "../overlays/LoadingScreen";
import { InfinitePlane } from "../../components/";
import { RealisticEffects } from "../../effects";
import DesktopPause from "../overlays/DesktopPause";
import MobilePause from "../overlays/MobilePause";
import { isMobile } from "react-device-detect";
import GlobalStyles from "../styles/GlobalStyles";

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
  shadowMap: true,
  gl: { alpha: false },
  camera: { position: [0, 2, 0], near: 0.01, far: 100 },
};

const defaultPhysicsProps: Partial<ProviderProps> = {
  iterations: 20,
  size: 10,
  allowSleep: false,
  defaultContactMaterial: {
    friction: 0,
  },
};

type StandardEnvironmentProps = {
  player?: {
    pos?: Vector3;
    rot?: number;
  };
  disableGround?: boolean;
  disableEffects?: boolean;
};

/**
 *
 * Standard environment should be your first choice for an environment
 *
 * Player Type: First Person w/ WASD, Joystick controls
 * Physics: Enabled with default y=0 floor plane
 * Loading Screen: Spaces Edition
 * Pause Menu: Spaces Edition
 *
 */
export const StandardEnvironment = (
  props: EnvironmentProps & StandardEnvironmentProps
) => {
  const {
    children,
    canvasProps,
    physicsProps,
    player,
    disableGround,
    disableEffects,
  } = props;

  const state = useEnvironmentState();

  return (
    <BrowserChecker>
      <GlobalStyles />
      <Container ref={state.containerRef}>
        <Canvas {...defaultCanvasProps} {...canvasProps}>
          <Physics {...defaultPhysicsProps} {...physicsProps}>
            <environmentStateContext.Provider value={state}>
              <Player initPos={player?.pos} initRot={player?.rot} />
              {!disableGround && <InfinitePlane height={-0.001} />}
              {!disableEffects && <RealisticEffects />}
              {children}
            </environmentStateContext.Provider>
          </Physics>
        </Canvas>
        <environmentStateContext.Provider value={state}>
          <LoadingScreen />
          <DesktopPause />
          {isMobile && <MobilePause />}
          <Crosshair />
        </environmentStateContext.Provider>
      </Container>
    </BrowserChecker>
  );
};
