import NetworkedEntities from "./ideas/NetworkedEntities";
import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  ConnectionConfig,
  ConnectionState,
  useConnection,
} from "./logic/connection";

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
  const { connected, connect, disconnect } = connection;

  // connect on start if autoconnect is enabled
  useEffect(() => {
    if (autoconnect && !connected) connect();
  }, [autoconnect, connected]);

  // log status on changes
  useEffect(() => {
    console.info(`network ${connected ? "connected" : "disconnected"}`);
  }, [connected]);

  // disconnect on the way out (i hope it works)
  useEffect(() => {
    window.addEventListener("beforeunload", disconnect);
    return () => window.removeEventListener("beforeunload", disconnect);
  }, [disconnect]);

  return (
    <NetworkContext.Provider value={connection}>
      {!disableEntities && <NetworkedEntities />}
      {children}
    </NetworkContext.Provider>
  );
}
