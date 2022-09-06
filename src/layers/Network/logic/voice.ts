import { DataConnection, Peer, MediaConnection } from "peerjs";
import { useCallback, useEffect, useMemo, useState } from "react";

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

export const useVoice = (
  enabled: boolean,
  peer: Peer | undefined,
  connections: Map<string, DataConnection>
): Map<string, MediaStream> => {
  const [stream, setStream] = useState<MediaStream>();
  const voiceStreams = useMemo<Map<string, MediaStream>>(
    () => new Map<string, MediaStream>(),
    []
  );

  // attempt to request permission for microphone, only try once
  const [attempted, setAttempted] = useState(false);
  useEffect(() => {
    if (!enabled || attempted) return;

    setAttempted(true);

    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    navigator.getUserMedia(
      { audio: true },
      (str) => setStream(str),
      (err) => {
        console.error(err);
      }
    );
  }, [attempted, enabled, peer]);

  const handleMediaConn = useCallback(
    (mediaConn: MediaConnection) => {
      console.log("media connection opened with peer", mediaConn.peer);
      mediaConn.answer(stream);

      mediaConn.on("stream", (str: MediaStream) => {
        voiceStreams.set(mediaConn.peer, str);
      });

      mediaConn.on("close", () => {
        console.log("closing voice stream with peer", mediaConn.peer);
        voiceStreams.delete(mediaConn.peer);
      });

      mediaConn.on("error", (err: any) => {
        console.error("error with voice stream with peer", mediaConn.peer, err);
        voiceStreams.delete(mediaConn.peer);
      });
    },
    [stream, voiceStreams]
  );

  const callPeer = useCallback(
    (conn: DataConnection, peer: Peer, stream: MediaStream) => {
      console.log("calling peer with id", conn.peer);
      handleMediaConn(peer.call(conn.peer, stream));
      conn.on("close", () => {
        console.log("closing voice stream with peer", conn.peer);
        voiceStreams.delete(conn.peer);
      });
    },
    [handleMediaConn, voiceStreams]
  );

  useEffect(() => {
    if (!peer || !stream) return;

    // set up incoming and outgoing calls for any future connections
    peer.on("call", handleMediaConn);
    peer.on("connection", (conn) => callPeer(conn, peer, stream));

    // call any already connected peers
    for (const [peerId, conn] of connections) {
      if (voiceStreams.has(peerId)) return;
      callPeer(conn, peer, stream);
    }
  }, [callPeer, connections, handleMediaConn, peer, stream, voiceStreams]);

  return voiceStreams;
};
