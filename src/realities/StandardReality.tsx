import { Physics, PhysicsProps } from "../layers/Physics";
import { Environment, EnvironmentProps } from "../layers/Environment";
import { Network, NetworkProps } from "../layers/Network";
import { Player, PlayerProps } from "../layers/Player";
import { InfinitePlane } from "../ideas/environment/InfinitePlane";
import { ReactNode } from "react";
import Toolbelt, { ToolbeltProps } from "../layers/Toolbelt";
import Enhance from "../layers/Enhance";

type StandardRealityProps = {
  children?: ReactNode | ReactNode[];
  environmentProps?: EnvironmentProps;
  physicsProps?: PhysicsProps;
  networkProps?: NetworkProps;
  playerProps?: PlayerProps;
  toolbeltProps?: ToolbeltProps;
  disableGround?: boolean;
};

export function StandardReality(props: StandardRealityProps) {
  const {
    children,
    environmentProps,
    physicsProps,
    networkProps,
    playerProps,
    toolbeltProps,
    disableGround = false,
  } = props;

  return (
    <Environment {...environmentProps}>
      <Physics {...physicsProps}>
        <Player {...playerProps}>
          <Toolbelt {...toolbeltProps}>
            <Network {...networkProps}>
              <Enhance>
                {!disableGround && <InfinitePlane />}
                {children}
              </Enhance>
            </Network>
          </Toolbelt>
        </Player>
      </Physics>
    </Environment>
  );
}
