import { DataConnection, Peer, MediaConnection } from "peerjs";
import { useEffect, useMemo } from "react";
import { useMicrophone } from "./mic";

/**
 * When enabled, is responsible for requesting mic permissions, calling and answering peers to create media connections,
 * and closing media connections on disable
 *
 * @param enabled
 * @param peer
 * @param connections
 */
export const useVoiceConnections = (
  enabled: boolean,
  peer: Peer | undefined,
  connections: Map<string, DataConnection>,
  inputDeviceId?: string
): {
  mediaConnections: Map<string, MediaConnection>;
  localStream: MediaStream | undefined;
} => {
  const mediaConns = useMemo<Map<string, MediaConnection>>(() => new Map(), []);

  const localStream = useMicrophone(enabled, inputDeviceId);

  // handle calling and answering peers
  useEffect(() => {
    if (!peer || !localStream || !enabled) return;

    // handle a new media connection (incoming or created
    const handleMediaConn = (mediaConn: MediaConnection) => {
      console.log("media connection opened with peer", mediaConn.peer);
      mediaConn.answer(localStream);
      mediaConns.set(mediaConn.peer, mediaConn);

      mediaConn.on("close", () => {
        console.log("closing voice stream with peer", mediaConn.peer);
        mediaConns.delete(mediaConn.peer);
      });

      mediaConn.on("error", (err: any) => {
        console.error("error with voice stream with peer", mediaConn.peer, err);
        mediaConns.delete(mediaConn.peer);
      });
    };

    const call = (conn: DataConnection) => {
      console.log("calling peer with id", conn.peer);
      handleMediaConn(peer.call(conn.peer, localStream));
      conn.on("close", () => {
        console.log("closing voice stream with peer", conn.peer);
        mediaConns.delete(conn.peer);
      });
    };

    const handleDataConn = (conn: DataConnection) => {
      conn.on("open", () => call(conn));
    };

    // set up incoming and outgoing calls for any future connections
    peer.on("call", handleMediaConn);
    peer.on("connection", handleDataConn);

    // call any already connected peers
    for (const [peerId, conn] of connections) {
      if (mediaConns.has(peerId)) return;
      call(conn);
    }

    return () => {
      peer.removeListener("call", handleMediaConn);
      peer.removeListener("connection", call);
    };
  }, [connections, peer, localStream, mediaConns, enabled]);

  // close all media connections with peers on disable
  useEffect(() => {
    if (!enabled) {
      mediaConns.forEach((conn) => {
        conn.close();
        mediaConns.delete(conn.peer);
      });
    }
  }, [enabled, mediaConns]);

  return { mediaConnections: mediaConns, localStream };
};
