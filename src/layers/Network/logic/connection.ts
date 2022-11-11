import { useEffect, useMemo, useState } from "react";
import { DataConnection, MediaConnection, Peer } from "peerjs";
import { isLocalNetwork } from "./local";
import { LocalSignaller } from "./signallers/LocalSignaller";
import { MuseSignaller } from "./signallers/MuseSignaller";
import { useWaving } from "./wave";
import { Signaller, SignallerConfig } from "./signallers";
import { Channels, useChannels } from "./channels";
import { useVoiceConnections } from "./voice";
import { getMuseIceServers } from "./ice";

export type ConnectionState = {
  connected: boolean;
  connect: (config?: ConnectionConfig) => Promise<void>;
  connections: Map<string, DataConnection>;
  mediaConnections: Map<string, MediaConnection>;
  localStream: MediaStream | undefined;
  disconnect: () => void;
  voice: boolean;
  setVoice: (v: boolean) => void;
  setInputDevice: (deviceId: string) => void;
  setOutputDevice: (deviceId: string) => void;
} & Pick<Channels, "useChannel">;

export type ConnectionConfig = {
  iceServers?: RTCIceServer[];
  voice?: boolean;
  inputDeviceId?: string;
  outputDeviceId?: string;
} & SignallerConfig;

export const useConnection = (
  externalConfig: ConnectionConfig
): ConnectionState => {
  const [connected, setConnected] = useState(false);
  const [peer, setPeer] = useState<Peer>();
  const connections = useMemo(() => new Map<string, DataConnection>(), []);
  const [signaller, setSignaller] = useState<Signaller>();

  const channels = useChannels(connections);

  // given any connection, store and set up data channels
  const registerConnection = (conn: DataConnection) => {
    conn.on("open", () => {
      console.log("connection opened with peer", conn.peer);
      conn.on("data", (message: any) => channels.receive({ conn, ...message }));
      conn.on("close", () => {
        console.log("connection closed with peer");
        connections.delete(conn.peer);
      });
      conn.on("error", () => {
        console.log("connection closed with peer");
        connections.delete(conn.peer);
      });
      channels.greet(conn);
      connections.set(conn.peer, conn);
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

    if (!finalConfig.iceServers) {
      const servers = await getMuseIceServers(finalConfig.host);
      if (servers) finalConfig.iceServers = servers;
    }

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
      const s =
        isLocalNetwork() && !finalConfig.host
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
    if (!peer.disconnected) peer.disconnect();
    if (signaller) signaller.leave();
    connections.forEach((conn) => conn.close());
    peer.destroy();
    setConnected(false);
    setPeer(undefined);
  };

  useWaving(1, signaller, disconnect);

  const [voice, setVoice] = useState(!!externalConfig.voice);
  const [inputDeviceId, setInputDevice] = useState<string>();
  const [outputDeviceId, setOutputDevice] = useState<string>();
  useEffect(() => setVoice(!!externalConfig.voice), [externalConfig.voice]);
  const { mediaConnections, localStream } = useVoiceConnections(
    voice,
    peer,
    connections,
    inputDeviceId
  );

  return {
    connected,
    connect,
    disconnect,
    connections,
    useChannel: channels.useChannel,
    voice,
    setVoice,
    localStream,
    mediaConnections,
    setInputDevice,
    setOutputDevice,
  };
};
