import { Physics } from "@react-three/cannon";
import Player, { PlayerProps } from "./layers/Player";
import {
  EnvironmentContext,
  Environment,
  EnvironmentProps,
} from "./layers/Environment";
import { ReactNode } from "react";
import { VRCanvas } from "@react-three/xr";
import { RegisterMenuItems } from "./layers/Environment/logic/menu";
import { defaultCanvasProps, defaultPhysicsProps } from "./logic/constants";
import { Props as ContainerProps } from "@react-three/fiber/dist/declarations/src/web/Canvas";
import { ProviderProps } from "@react-three/cannon/dist/Provider";
import { useContextBridge } from "@react-three/drei";

type FundamentalRealityProps = {
  children?: ReactNode | ReactNode[];
  canvasProps?: Partial<ContainerProps>;
  physicsProps?: Partial<ProviderProps>;
  playerProps?: PlayerProps;
  environmentProps?: EnvironmentProps;
};

export function FundamentalReality(props: FundamentalRealityProps) {
  const {
    children,
    canvasProps,
    physicsProps,
    playerProps,
    environmentProps,
  } = props;

  const EnvironmentBridge = useContextBridge(EnvironmentContext);

  return (
    <Environment {...environmentProps}>
      <VRCanvas {...defaultCanvasProps} {...canvasProps}>
        <RegisterMenuItems />
        <Physics {...defaultPhysicsProps} {...physicsProps}>
          <EnvironmentBridge>
            <Player {...playerProps}>{children}</Player>
          </EnvironmentBridge>
        </Physics>
      </VRCanvas>
    </Environment>
  );
}
