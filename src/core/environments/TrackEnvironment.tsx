import { ReactNode, useCallback, useEffect, useState } from "react";
import { useEnvironmentState, environmentStateContext } from "../utils/hooks";
import BrowserChecker from "../utils/BrowserChecker";
import styled from "@emotion/styled";
import Crosshair from "../ui/Crosshair";
import { ProviderProps } from "@react-three/cannon/dist/Provider";
import { Physics } from "@react-three/cannon";
import { Canvas } from "react-three-fiber";
import { ContainerProps } from "react-three-fiber/targets/shared/web/ResizeContainer";
import { Environment, EnvironmentProps, TrackEnvironmentState } from "../types";
import LoadingScreen from "../overlays/LoadingScreen";
import { RealisticEffects } from "../../effects";
import DesktopPause from "../overlays/DesktopPause";
import MobilePause from "../overlays/MobilePause";
import { isMobile } from "react-device-detect";
import GlobalStyles from "../styles/GlobalStyles";
import TrackPlayer from "../players/TrackPlayer";
import { TrackKeyframe } from "../types/keyframes";
import { TrackControlDisplay } from "../overlays/TrackControlDisplay";
import { config, useSpring } from "react-spring";
import { TrackScaled } from "../../modifiers/TrackScaled";

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

type TrackEnvironmentProps = {
  keyframes: TrackKeyframe[];
  effects?: ReactNode;
};

/**
 *
 * Track environment moves camera between keyframes using arrow keys
 *
 * Player Type: First Person w/ Mouse, Drag controls
 * Physics: Enabled with default y=0 floor plane
 * Loading Screen: Spaces Edition
 * Pause Menu: Spaces Edition
 *
 */

export const TrackEnvironment = (
  props: EnvironmentProps & TrackEnvironmentProps
) => {
  const { children, canvasProps, physicsProps, keyframes, effects } = props;

  const [keyframeIndex, setKeyframeIndex] = useState(0);
  const scale = keyframes[keyframeIndex].scale || 1;
  const keyframePos = keyframes[keyframeIndex].position;
  const [spring, setSpring] = useSpring(() => ({
    xyzs: [
      keyframePos.x * scale,
      keyframePos.y * scale,
      keyframePos.z * scale,
      scale,
    ],
    config: config.molasses,
  }));

  // update keyframe positions
  useEffect(() => {
    console.log(keyframes[keyframeIndex].label);
    const posArray = keyframes[keyframeIndex].position.toArray();
    const scale = keyframes[keyframeIndex].scale || 1;
    setSpring({ xyzs: [...posArray, scale] });
  }, [keyframeIndex]);

  const state = useEnvironmentState();
  const localState: TrackEnvironmentState = {
    ...state,
    type: Environment.TRACK,
    keyframes: {
      getCurrent: useCallback(() => keyframes[keyframeIndex], [keyframeIndex]),
      setCurrent: (i: number) => setKeyframeIndex(i),
      frames: keyframes,
      currentFrame: keyframes[keyframeIndex],
      currentIndex: keyframeIndex,
    },
  };

  return (
    <BrowserChecker>
      <GlobalStyles />
      <Container ref={state.containerRef}>
        <Canvas {...defaultCanvasProps} {...canvasProps}>
          <Physics {...defaultPhysicsProps} {...physicsProps}>
            <environmentStateContext.Provider value={localState}>
              <TrackPlayer spring={spring} />
              {effects || <RealisticEffects />}
              <TrackScaled spring={spring}>{children}</TrackScaled>
            </environmentStateContext.Provider>
          </Physics>
        </Canvas>
        <environmentStateContext.Provider value={localState}>
          <LoadingScreen />
          <DesktopPause />
          {isMobile && <MobilePause />}
          <TrackControlDisplay />
          <Crosshair />
        </environmentStateContext.Provider>
      </Container>
    </BrowserChecker>
  );
};
