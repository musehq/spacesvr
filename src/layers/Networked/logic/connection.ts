import { useEffect, useMemo, useState } from "react";
import { DataConnection, Peer } from "peerjs";
import { DataManager, useDataManager } from "./dataManager";
import { isLocalNetwork } from "./local";
import { LocalSignaller } from "./signallers/LocalSignaller";
import { MuseSignaller } from "./signallers/MuseSignaller";
import { ConnectionConfig, Signaller } from "./types";
import { useHealth } from "./health";

export type ConnectionState = {
  connected: boolean;
  connect: () => void;
  connections: Map<string, DataConnection>;
  disconnect: () => void;
  send: (type: string, data: any) => void;
} & Pick<DataManager, "useStream">;

export const useConnection = (externalConfig: ConnectionConfig) => {
  const [peer, setPeer] = useState<Peer>();
  const connections = useMemo(() => new Map<string, DataConnection>(), []);
  const [connected, setConnected] = useState(false);
  const [signaller, setSignaller] = useState<Signaller>();

  const dataManager = useDataManager();

  // given any connection, store and set up data channels
  const registerConnection = (conn: DataConnection) => {
    conn.on("open", () => {
      console.log("connection opened with peer", conn.peer);
      connections.set(conn.peer, conn);
      conn.on("data", (message: any) =>
        dataManager.process({ conn, type: message.type, data: message.data })
      );
      conn.on("close", () => {
        console.log("connection closed with peer");
        connections.delete(conn.peer);
      });
    });
  };

  // attempt to connect to a p2p network
  const connect = async (config?: ConnectionConfig) => {
    console.log("connecting to network");
    if (peer) {
      console.error("peer already created, aborting");
      return;
    }
    if (connected) {
      console.error("already connected, aborting");
      return;
    }

    const finalConfig = { ...externalConfig, ...config };

    const peerConfig: any = {};
    if (finalConfig.iceServers) peerConfig.iceServers = finalConfig.iceServers;
    const p = new Peer({ config: peerConfig });

    p.on("connection", registerConnection); // incoming
    p.on("close", disconnect);
    p.on("error", (err) => {
      if (err.message.includes("Could not connect to peer")) {
        const messageWords = err.message.split(" ");
        const connId = messageWords[messageWords.length - 1];
        console.error(`could not establish connection to peer ${connId}`);
      } else {
        console.error(err);
      }
    });
    p.on("open", async () => {
      setConnected(true);
      const s = isLocalNetwork()
        ? new LocalSignaller(p)
        : new MuseSignaller(p, finalConfig);
      const ids = await s.join();
      console.log("found peers:", ids);
      if (!ids) return;
      ids.map((id) => {
        if (id === p.id) return;
        const conn = p.connect(id);
        registerConnection(conn);
      });
      setPeer(p);
      setSignaller(s);
    });
  };

  // attempt to disconnect from a p2p network
  const disconnect = () => {
    console.log("disconnecting from network");
    if (!connected) {
      console.error("not connected, no need to disconnect");
      return;
    }
    if (!peer) {
      console.error("peer doesn't exist, no need to disconnect");
      return;
    }
    if (signaller) signaller.leave();
    if (!peer.disconnected) peer.disconnect();
    peer.destroy();
    setConnected(false);
    setPeer(undefined);
  };

  function send(type: string, data: any) {
    if (!connected) {
      console.error("can't send message, disconnected");
      return;
    }
    for (const [, conn] of connections.entries()) {
      if (conn.open) {
        conn.send({ type, data });
      }
    }
  }

  useHealth(0.75, signaller, disconnect);
  useEffect(() => {
    console.info(`peer connection ${connected ? "connected" : "disconnected"}`);
  }, [connected]);

  return {
    connected,
    connect,
    disconnect,
    connections,
    send,
    useStream: dataManager.useStream,
  };
};
