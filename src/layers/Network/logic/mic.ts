import { useEffect, useState } from "react";

/**
 * WHen enabled, will ask user for mic permissions and return the local microphone stream
 * @param enabled
 */
export const useMicrophone = (enabled = true): MediaStream | undefined => {
  const [localStream, setLocalStream] = useState<MediaStream>();

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
      (str) => setLocalStream(str),
      (err) => {
        console.error(err);
      }
    );
  }, [attempted, enabled]);

  return localStream;
};
