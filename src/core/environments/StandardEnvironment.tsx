import BrowserChecker from "../overlays/BrowserChecker";
import styled from "@emotion/styled";
import Crosshair from "../tools/Crosshair";
import { ProviderProps } from "@react-three/cannon/dist/Provider";
import { Physics } from "@react-three/cannon";
import { Canvas } from "react-three-fiber";
import { Vector3 } from "three";
import { ContainerProps } from "react-three-fiber/targets/shared/web/ResizeContainer";
import Player from "../players/Player";
import { useEnvironmentState, environmentStateContext } from "../utils/hooks";
import { EnvironmentProps } from "../types";
import { InfinitePlane } from "../../components/";
import { RealisticEffects } from "../../effects";
import GlobalStyles from "../styles/GlobalStyles";
import { ReactNode } from "react";
import PauseMenu from "../tools/PauseMenu";
import Tool from "../../modifiers/Tool";
import LoadingScreen from "../overlays/LoadingScreen";

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
    cursor: none;
  }
`;

const defaultCanvasProps: Partial<ContainerProps> = {
  shadowMap: true,
  gl: { alpha: false },
  camera: { position: [0, 2, 0], near: 0.01, far: 150 },
};

const defaultPhysicsProps: Partial<ProviderProps> = {
  size: 50,
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
  effects?: ReactNode;
  disableGround?: boolean;
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
    effects,
    disableGround,
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
              {effects || <RealisticEffects />}
              {children}
            </environmentStateContext.Provider>
          </Physics>
          <Crosshair />
          <Tool pos={[-1, 1]} face>
            <PauseMenu />
          </Tool>
          <Tool pos={[1, -1]} face>
            <mesh>
              <boxBufferGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="red" />
            </mesh>
          </Tool>
        </Canvas>
        <environmentStateContext.Provider value={state}>
          <LoadingScreen />
        </environmentStateContext.Provider>
      </Container>
    </BrowserChecker>
  );
};
