import { DataConnection, Peer, MediaConnection } from "peerjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMicrophone } from "./mic";

type GetUserMedia = (
  options: { video?: boolean; audio?: boolean },
  success: (stream: any) => void,
  error?: (error: string) => void
) => void;

declare global {
  interface Navigator {
    getUserMedia: GetUserMedia;
    webkitGetUserMedia?: GetUserMedia;
    mozGetUserMedia?: GetUserMedia;
    msGetUserMedia?: GetUserMedia;
  }
}

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
  connections: Map<string, DataConnection>
): Map<string, MediaConnection> => {
  const mediaConns = useMemo<Map<string, MediaConnection>>(() => new Map(), []);
  const localStream = useMicrophone(enabled);

  const handleMediaConn = useCallback(
    (mediaConn: MediaConnection) => {
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
    },
    [localStream, mediaConns]
  );

  const callPeer = useCallback(
    (conn: DataConnection, peer: Peer, stream: MediaStream) => {
      console.log("calling peer with id", conn.peer);
      handleMediaConn(peer.call(conn.peer, stream));
      conn.on("close", () => {
        console.log("closing voice stream with peer", conn.peer);
        mediaConns.delete(conn.peer);
      });
    },
    [handleMediaConn, mediaConns]
  );

  // handle calling of peers
  useEffect(() => {
    if (!peer || !localStream) return;

    const call = (conn: DataConnection) => callPeer(conn, peer, localStream);

    // set up incoming and outgoing calls for any future connections
    peer.on("call", handleMediaConn);
    peer.on("connection", call);

    // call any already connected peers
    for (const [peerId, conn] of connections) {
      if (mediaConns.has(peerId)) return;
      callPeer(conn, peer, localStream);
    }

    return () => {
      peer.removeListener("call", handleMediaConn);
      peer.removeListener("connection", call);
    };
  }, [
    callPeer,
    connections,
    handleMediaConn,
    peer,
    localStream,
    mediaConns,
    enabled,
  ]);

  // close all media connections with peers on disable
  useEffect(() => {
    if (!enabled) {
      mediaConns.forEach((conn) => {
        conn.close();
        mediaConns.delete(conn.peer);
      });
    }
  }, [enabled, mediaConns]);

  return mediaConns;
};
