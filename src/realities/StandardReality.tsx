import { Physics, PhysicsProps } from "../layers/Physics";
import { Environment, EnvironmentProps } from "../layers/Environment";
import { Network, NetworkProps } from "../layers/Network";
import { Player, PlayerProps } from "../layers/Player";
import { InfinitePlane } from "../ideas/physical/InfinitePlane";
import { ReactNode } from "react";
import Toolbelt from "../layers/Toolbelt";

type StandardRealityProps = {
  children?: ReactNode | ReactNode[];
  environmentProps?: EnvironmentProps;
  physicsProps?: PhysicsProps;
  networkProps?: NetworkProps;
  playerProps?: PlayerProps;
  disableGround?: boolean;
};

export function StandardReality(props: StandardRealityProps) {
  const {
    children,
    environmentProps,
    physicsProps,
    networkProps,
    playerProps,
    disableGround = false,
  } = props;

  return (
    <Environment {...environmentProps}>
      <Physics {...physicsProps}>
        <Player {...playerProps}>
          <Toolbelt>
            <Network {...networkProps}>
              {!disableGround && <InfinitePlane />}
              {children}
            </Network>
          </Toolbelt>
        </Player>
      </Physics>
    </Environment>
  );
}
