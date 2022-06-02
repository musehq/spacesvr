import { Physics, PhysicsProps } from "../layers/Physics";
import { Environment, EnvironmentProps } from "../layers/Environment";
import { Networked } from "../layers/Networked";
import { Player, PlayerProps } from "../layers/Player";
import { InfinitePlane } from "../ideas/physical/InfinitePlane";
import { ReactNode } from "react";

type StandardRealityProps = {
  children?: ReactNode | ReactNode[];
  physicsProps?: PhysicsProps;
  playerProps?: PlayerProps;
  environmentProps?: EnvironmentProps;
  disableGround?: boolean;
};

export function StandardReality(props: StandardRealityProps) {
  const {
    children,
    physicsProps,
    playerProps,
    environmentProps,
    disableGround = false,
  } = props;

  return (
    <Environment {...environmentProps}>
      <Physics {...physicsProps}>
        <Player {...playerProps}>
          <Networked>
            {!disableGround && <InfinitePlane />}
            {children}
          </Networked>
        </Player>
      </Physics>
    </Environment>
  );
}
