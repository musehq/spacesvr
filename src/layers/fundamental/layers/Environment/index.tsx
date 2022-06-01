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
import { MenuItem } from "./logic/menu";

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
};

export function Environment(
  props: { children: ReactNode | ReactNode[] } & EnvironmentProps
) {
  const { loadingScreen, pauseMenu, dev, children } = props;

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
    <EnvironmentContext.Provider value={value}>
      <GlobalStyles />
      <Container ref={container}>
        {loadingScreen || <LoadingScreen />}
        {pauseMenu || <PauseMenu dev={dev} />}
        <Crosshair />
        {children}
      </Container>
    </EnvironmentContext.Provider>
  );
}
