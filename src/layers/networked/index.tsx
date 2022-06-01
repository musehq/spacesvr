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

export default function Networked(
  props: { children: ReactNode | ReactNode[] } & NetworkedProps
) {
  const { children, ...rest } = props;

  const state = useNetwork();

  return (
    <NetworkedContext.Provider value={state}>
      <Entities />
      {children}
    </NetworkedContext.Provider>
  );
}
