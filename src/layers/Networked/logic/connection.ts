import { useMemo, useState } from "react";
import { DataConnection, Peer } from "peerjs";
import { getSignalledPeers, removeSignalledPeer } from "./signal";
import { DataManager, useDataManager } from "./dataManager";

export type ConnectionState = {
  connected: boolean;
  connect: () => void;
  connections: Map<string, DataConnection>;
  disconnect: () => void;
  send: (type: string, data: any) => void;
} & Pick<DataManager, "useStream">;

type ConnectionConfig = {
  iceServers?: RTCIceServer[];
};

export const useConnection = (config: ConnectionConfig) => {
  const [peer, setPeer] = useState<Peer>();
  const connections = useMemo(() => new Map<string, DataConnection>(), []);
  const [connected, setConnected] = useState(false);

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
        removeSignalledPeer(conn.peer, peer);
      });
    });
    conn.on("error", () => {
      console.error("connection with peer errored");
      removeSignalledPeer(conn.peer, peer);
    });
  };

  // attempt to connect to a p2p network
  const connect = async () => {
    console.log("connecting to network");
    if (peer) {
      console.error("peer already created");
      return;
    }
    if (connected) {
      console.error("already connected");
      return;
    }
    const locConfig: any = {};
    if (config.iceServers) locConfig.iceServers = config.iceServers;
    const p = new Peer({ config: locConfig });
    p.on("connection", registerConnection); // incoming
    p.on("close", disconnect);
    p.on("error", (err) => {
      if (err.message.includes("Could not connect to peer")) {
        const messageWords = err.message.split(" ");
        const connId = messageWords[messageWords.length - 1];
        console.error(`could not establish connection to peer ${connId}`);
        removeSignalledPeer(connId, peer);
      } else {
        console.error(err);
      }
    });
    p.on("open", async () => {
      setConnected(true);
      const ids = await getSignalledPeers(p);
      console.log("found peers:", ids);
      if (!ids) return;
      ids.map((id) => {
        if (id === p.id) return;
        const conn = p.connect(id);
        registerConnection(conn);
      });
      setPeer(p);
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

  console.info(`peer connection ${connected ? "connected" : "disconnected"}`);

  return {
    connected,
    connect,
    disconnect,
    send,
    connections,
    useStream: dataManager.useStream,
  };
};
