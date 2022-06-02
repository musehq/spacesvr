import Entities from "./ideas/Entities";
import { createContext, MutableRefObject, ReactNode, useContext } from "react";
import { usePeerConnection } from "./logic/connect";
import { usePlayerStream } from "./logic/stream";
import { Peer, DataConnection } from "peerjs";
import { Entity } from "./logic/oldNetwork";

export type NetworkedState = {
  peer: Peer;
  connected: boolean;
  connect: () => void;
  sendEvent: (type: string, data: any) => void;
  connections: Map<string, DataConnection>;
  data: MutableRefObject<Map<string, Entity> | undefined>;
  fetch: (type: string) => Map<string, Entity>;
};

export const NetworkedContext = createContext({} as NetworkedState);
export const useNetwork = () => useContext(NetworkedContext);

export type NetworkedProps = {
  frequency?: number;
  audio?: boolean;
};

type NetworkedLayer = { children: ReactNode | ReactNode[] } & NetworkedProps;

export function Networked(props: NetworkedLayer) {
  const { children, ...networkProps } = props;

  const connection = usePeerConnection();
  usePlayerStream(connection);

  return (
    <NetworkedContext.Provider value={connection}>
      <Entities />
      {children}
    </NetworkedContext.Provider>
  );
}
