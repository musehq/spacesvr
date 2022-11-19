import NetworkedEntities from "./ideas/NetworkedEntities";
import { ReactNode, useEffect, useRef } from "react";
import { ConnectionConfig, useConnection } from "./logic/connection";
import { NetworkContext } from "./logic/network";
import { WalkieTalkie } from "../../tools/WalkieTalkie";
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
    if (autoconnect) connect();
  }, [autoconnect]);

  // log status on changes
  const lastVal = useRef(false);
  useEffect(() => {
    if (lastVal.current !== connected) {
      console.info(`network ${connected ? "connected" : "disconnected"}`);
      lastVal.current = connected;
    }
  }, [connected]);

  // disconnect on the way out (i hope it works)
  useEffect(() => {
    window.addEventListener("beforeunload", disconnect);
    return () => window.removeEventListener("beforeunload", disconnect);
  }, [disconnect]);

  return (
    <NetworkContext.Provider value={connection}>
      {!disableEntities && <NetworkedEntities />}
      {connection.voice && <WalkieTalkie />}
      {children}
    </NetworkContext.Provider>
  );
}
