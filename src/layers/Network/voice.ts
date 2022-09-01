import { DataConnection, Peer, MediaConnection } from "peerjs";
import { useEffect, useState } from "react";

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
): void => {
  const [stream, setStream] = useState<MediaStream>();

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

      mediaConn.on("stream", (stream: MediaStream) => {
        const audioElem = document.createElement("audio");
        audioElem.id = mediaConn.peer;
        audioElem.autoplay = true;
        audioElem.srcObject = stream;
        document.body.appendChild(audioElem);
      });

      mediaConn.on("close", () => {
        const audioElem = document.getElementById(mediaConn.peer);
        if (audioElem) audioElem.remove();
      });

      mediaConn.on("error", (err: any) => {
        console.log(err);
      });
    };

    peer.on("call", handleMediaConn);
    peer.on("connection", (dataConn) => {
      handleMediaConn(peer.call(dataConn.peer, stream));
    });
  }, [connections, peer, stream]);
};
