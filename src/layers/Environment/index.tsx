import { ReactNode } from "react";
import { Container } from "./ui/Container";
import GlobalStyles from "./ui/GlobalStyles";
import LoadingScreen from "./ui/LoadingScreen";
import PauseMenu from "./ui/PauseMenu";
import Crosshair from "./ui/Crosshair";
import { RegisterMenuItems } from "./logic/menu";
import { Props as ContainerProps } from "@react-three/fiber/dist/declarations/src/web/Canvas";
import { VRCanvas } from "@react-three/xr";
import { defaultCanvasProps } from "./logic/canvas";
import { EnvironmentContext, useEnvironmentState } from "./logic/environment";
import KillEnterVRButton from "./ui/KillEnterVRButton";
export * from "./logic/environment";

export type EnvironmentProps = {
  pauseMenu?: ReactNode;
  loadingScreen?: ReactNode;
  dev?: boolean;
  canvasProps?: Partial<ContainerProps>;
};

type EnvironmentLayerProps = {
  children: ReactNode | ReactNode[];
} & EnvironmentProps;

export function Environment(props: EnvironmentLayerProps) {
  const { loadingScreen, pauseMenu, dev, canvasProps, children } = props;

  const state = useEnvironmentState();

  return (
    <>
      <GlobalStyles />
      <Container ref={state.containerRef}>
        <EnvironmentContext.Provider value={state}>
          {loadingScreen || <LoadingScreen />}
          {pauseMenu || <PauseMenu dev={dev} />}
          <Crosshair />
        </EnvironmentContext.Provider>
        <VRCanvas {...defaultCanvasProps} {...canvasProps}>
          <KillEnterVRButton />
          <EnvironmentContext.Provider value={state}>
            <RegisterMenuItems />
            {children}
          </EnvironmentContext.Provider>
        </VRCanvas>
      </Container>
    </>
  );
}
