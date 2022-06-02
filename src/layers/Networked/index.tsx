import Entities from "./ideas/Entities";
import { NetworkedContext, useNetwork } from "./logic/network";
import { ReactNode } from "react";

export type NetworkedProps = {
  signalHost?: string;
  signalPort?: number;
  signalPath?: string;
  socketServer?: string;
  frequency?: number;
  audio?: boolean;
};

type NetworkedLayer = { children: ReactNode | ReactNode[] } & NetworkedProps;

export function Networked(props: NetworkedLayer) {
  const { children, ...networkProps } = props;

  const state = useNetwork();

  return (
    <NetworkedContext.Provider value={state}>
      <Entities />
      {children}
    </NetworkedContext.Provider>
  );
}
