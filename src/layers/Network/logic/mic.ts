import { useEffect, useState } from "react";
import { useEnvironment } from "../../Environment";

/**
 * WHen enabled, will ask user for mic permissions and return the local microphone stream
 * @param enabled
 */
export const useMicrophone = (
  enabled = true,
  inputDeviceId?: string
): MediaStream | undefined => {
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
  useEffect(() => {
    // https://bugs.webkit.org/show_bug.cgi?id=230902#c47
    if (!enabled || (iOS() && firstPaused)) return;

    navigator.mediaDevices
      ?.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          ...(inputDeviceId ? { deviceId: inputDeviceId } : {}),
        },
      })
      .then((stream) => {
        setLocalStream(stream);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [enabled, firstPaused, inputDeviceId]);

  return localStream;
};
