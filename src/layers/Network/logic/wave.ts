import { useLimiter } from "../../../logic/limiter";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { ConnectionState } from "./connection";
import { Signaller } from "./signallers";

const MAX_TRIES = 4;

export const useWaving = (
  minuteFrequency: number,
  singaller: Signaller | undefined,
  disconnect: ConnectionState["disconnect"]
) => {
  const numFailed = useRef(0);

  const waveLimiter = useLimiter(1 / (minuteFrequency * 60));
  const failLimiter = useLimiter(1 / 10);
  useFrame(({ clock }) => {
    if (!singaller || numFailed.current > MAX_TRIES) return;

    const FAIL_STATE = numFailed.current > 0;
    if (!(FAIL_STATE ? failLimiter : waveLimiter).isReady(clock)) {
      return;
    }

    singaller.wave().then((succeeded) => {
      if (!succeeded) {
        numFailed.current += 1;
      } else {
        numFailed.current = 0;
      }

      if (numFailed.current > MAX_TRIES) {
        console.error("too many failed waves, disconnecting ...");
        disconnect();
      }
    });
  });
};
