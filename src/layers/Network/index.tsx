import NetworkedEntities from "./ideas/NetworkedEntities";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { ConnectionState, useConnection } from "./logic/connection";
import { ConnectionConfig } from "./logic/types";

export type NetworkState = ConnectionState;
export const NetworkContext = createContext({} as NetworkState);
export const useNetwork = (): NetworkState => useContext(NetworkContext);

export type NetworkProps = {
  disableEntities?: boolean;
  autoconnect?: boolean;
} & ConnectionConfig;

type NetworkLayer = { children: ReactNode | ReactNode[] } & NetworkProps;

export function Network(props: NetworkLayer) {
  const { children, disableEntities, autoconnect, ...connectionConfig } = props;

  const connection = useConnection(connectionConfig);

  // connect on start if autoconnect is enabled
  useEffect(() => {
    if (!autoconnect || connection.connected) return;
    connection.connect();
  }, [autoconnect, connection]);

  return (
    <NetworkContext.Provider value={connection}>
      {!disableEntities && <NetworkedEntities />}
      {children}
    </NetworkContext.Provider>
  );
}
