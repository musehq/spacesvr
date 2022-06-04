import NetworkedEntities from "./ideas/NetworkedEntities";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { ConnectionState, useConnection } from "./logic/connection";
import { ConnectionConfig } from "./logic/types";

export type NetworkedState = ConnectionState;
export const NetworkedContext = createContext({} as NetworkedState);
export const useNetworked = (): NetworkedState => useContext(NetworkedContext);

export type NetworkedProps = {
  disableEntities?: boolean;
  autoconnect?: boolean;
} & ConnectionConfig;

type NetworkedLayer = { children: ReactNode | ReactNode[] } & NetworkedProps;

export function Networked(props: NetworkedLayer) {
  const { children, disableEntities, autoconnect, ...connectionConfig } = props;

  const connection = useConnection(connectionConfig);

  // connect on start if autoconnect is enabled
  useEffect(() => {
    if (autoconnect || connection.connected) return;
    connection.connect();
  }, [autoconnect, connection]);

  return (
    <NetworkedContext.Provider value={connection}>
      {!disableEntities && <NetworkedEntities />}
      {children}
    </NetworkedContext.Provider>
  );
}
