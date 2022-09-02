import { DataConnection, Peer, MediaConnection } from "peerjs";
import { useEffect, useMemo, useState } from "react";

declare global {
  interface Navigator {
    getUserMedia(
      options: { video?: boolean; audio?: boolean },
      success: (stream: any) => void,
      error?: (error: string) => void
    ): void;
  }
}

export const useVoice = (
  enable: boolean | undefined,
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
    if (!enable || attempted) return;

    navigator.getUserMedia =
      navigator.getUserMedia ||
      // @ts-ignore
      navigator.webkitGetUserMedia ||
      // @ts-ignore
      navigator.mozGetUserMedia ||
      // @ts-ignore
      navigator.msGetUserMedia;

    setAttempted(true);
    navigator.getUserMedia(
      { audio: true },
      (stream: MediaStream) => {
        setStream(stream);
      },
      (err) => {
        console.error(err);
        setStream(undefined);
      }
    );
  }, [attempted, enable, peer]);

  useEffect(() => {
    if (!peer || !stream || !connections) return;

    const handleMediaConn = (mediaConn: MediaConnection) => {
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
    };

    peer.on("call", handleMediaConn);
    peer.on("connection", (dataConn) => {
      handleMediaConn(peer.call(dataConn.peer, stream));
      dataConn.on("close", () => {
        console.log("closing voice stream with peer", dataConn.peer);
        voiceStreams.delete(dataConn.peer);
      });
    });
  }, [connections, peer, stream, voiceStreams]);

  return voiceStreams;
};
