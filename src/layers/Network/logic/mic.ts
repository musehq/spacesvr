import { useEffect, useState } from "react";
import { useEnvironment } from "../../Environment";

/**
 * WHen enabled, will ask user for mic permissions and return the local microphone stream
 * @param enabled
 */
export const useMicrophone = (enabled = true): MediaStream | undefined => {
  const { paused } = useEnvironment();
  const [firstPaused, setFirstPaused] = useState(true);
  useEffect(() => setFirstPaused(paused && firstPaused), [paused, firstPaused]);

  function iOS() {
    return (
      [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
  }

  const [localStream, setLocalStream] = useState<MediaStream>();

  // attempt to request permission for microphone, only try once
  const [attempted, setAttempted] = useState(false);
  useEffect(() => {
    // https://bugs.webkit.org/show_bug.cgi?id=230902#c47
    if (!enabled || attempted || (iOS() && firstPaused)) return;

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
  }, [attempted, enabled, firstPaused]);

  return localStream;
};
