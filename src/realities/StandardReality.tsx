import { Physics, PhysicsProps } from "../layers/Physics";
import { Environment, EnvironmentProps } from "../layers/Environment";
import { Networked, NetworkedProps } from "../layers/Networked";
import { Player, PlayerProps } from "../layers/Player";
import { InfinitePlane } from "../ideas/physical/InfinitePlane";
import { ReactNode } from "react";

type StandardRealityProps = {
  children?: ReactNode | ReactNode[];
  environmentProps?: EnvironmentProps;
  physicsProps?: PhysicsProps;
  networkedProps?: NetworkedProps;
  playerProps?: PlayerProps;
  disableGround?: boolean;
};

export function StandardReality(props: StandardRealityProps) {
  const {
    children,
    environmentProps,
    physicsProps,
    networkedProps,
    playerProps,
    disableGround = false,
  } = props;

  return (
    <Environment {...environmentProps}>
      <Physics {...physicsProps}>
        <Networked {...networkedProps}>
          <Player {...playerProps}>
            {!disableGround && <InfinitePlane />}
            {children}
          </Player>
        </Networked>
      </Physics>
    </Environment>
  );
}
