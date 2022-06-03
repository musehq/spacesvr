import NetworkedEntities from "./ideas/NetworkedEntities";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { ConnectionState, useConnection } from "./logic/connection";

export type NetworkedState = ConnectionState;
export const NetworkedContext = createContext({} as NetworkedState);
export const useNetworked = (): NetworkedState => useContext(NetworkedContext);

export type NetworkedProps = {
  iceServers?: RTCIceServer[];
  disableEntities?: boolean;
};

type NetworkedLayer = { children: ReactNode | ReactNode[] } & NetworkedProps;

export function Networked(props: NetworkedLayer) {
  const { children, iceServers, disableEntities } = props;

  const connection = useConnection({ iceServers });

  // by default, connect on start
  useEffect(() => {
    if (!connection.connected) connection.connect();
  }, [connection]);

  return (
    <NetworkedContext.Provider value={connection}>
      {!disableEntities && <NetworkedEntities />}
      {children}
    </NetworkedContext.Provider>
  );
}
