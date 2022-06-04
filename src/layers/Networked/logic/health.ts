import { Signaller } from "./types";
import { useLimiter } from "../../../logic/limiter";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { ConnectionState } from "./connection";

const MAX_TRIES = 3;

export const useHealth = (
  minuteFrequency: number,
  singaller: Signaller | undefined,
  disconnect: ConnectionState["disconnect"]
) => {
  const numFailed = useRef(0);

  const limiter = useLimiter(1 / (minuteFrequency * 60));
  useFrame(({ clock }) => {
    if (
      !singaller ||
      !limiter.isReady(clock) ||
      numFailed.current > MAX_TRIES
    ) {
      return;
    }

    singaller.health().then((succeeded) => {
      if (!succeeded) {
        numFailed.current += 1;
      } else {
        numFailed.current = 0;
      }

      if (numFailed.current > MAX_TRIES) {
        disconnect();
      }
    });
  });
};
