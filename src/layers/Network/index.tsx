import NetworkedEntities from "./ideas/NetworkedEntities";
import { ReactNode, useEffect } from "react";
import { ConnectionConfig, useConnection } from "./logic/connection";
import { NetworkContext } from "./logic/network";
export * from "./logic/network";

export type NetworkProps = {
  disableEntities?: boolean;
  autoconnect?: boolean;
} & ConnectionConfig;

type NetworkLayerProps = { children: ReactNode | ReactNode[] } & NetworkProps;

export function Network(props: NetworkLayerProps) {
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
