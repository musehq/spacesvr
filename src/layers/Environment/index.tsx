import {
  createContext,
  MutableRefObject,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import { Container } from "./ui/Container";
import GlobalStyles from "./ui/GlobalStyles";
import { Device, DeviceState, useDevice } from "./logic/device";
import LoadingScreen from "./ui/LoadingScreen";
import PauseMenu from "./ui/PauseMenu";
import Crosshair from "./ui/Crosshair";
import { MenuItem, RegisterMenuItems } from "./logic/menu";
import { Props as ContainerProps } from "@react-three/fiber/dist/declarations/src/web/Canvas";
import { VRCanvas } from "@react-three/xr";
import { defaultCanvasProps } from "./logic/canvas";

export interface EnvironmentState {
  paused: boolean;
  setPaused: (p: boolean, overlay?: string) => void;
  device: DeviceState;
  setDevice: (d: Device) => void;
  containerRef: MutableRefObject<HTMLDivElement | null>;
  menuItems: MenuItem[];
  setMenuItems: (i: MenuItem[]) => void;
}

export const EnvironmentContext = createContext({} as EnvironmentState);
export const useEnvironment = () => useContext(EnvironmentContext);

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

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const container = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(true);

  const device = useDevice();

  const value = {
    ...device,
    paused,
    setPaused,
    containerRef: container,
    menuItems,
    setMenuItems,
  };

  return (
    <>
      <GlobalStyles />
      <Container ref={container}>
        <EnvironmentContext.Provider value={value}>
          {loadingScreen || <LoadingScreen />}
          {pauseMenu || <PauseMenu dev={dev} />}
          <Crosshair />
        </EnvironmentContext.Provider>
        <VRCanvas {...defaultCanvasProps} {...canvasProps}>
          <EnvironmentContext.Provider value={value}>
            <RegisterMenuItems />
            {children}
          </EnvironmentContext.Provider>
        </VRCanvas>
      </Container>
    </>
  );
}
