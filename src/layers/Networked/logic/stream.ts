import { useLimiter } from "../../../logic/limiter";
import { useFrame } from "@react-three/fiber";
import { NetworkedState } from "../index";

export const usePlayerStream = (connection: NetworkedState) => {
  const { connected, sendEvent } = connection;

  const limiter = useLimiter(40);
  useFrame(({ clock, camera }) => {
    if (!limiter.isReady(clock) || !connected) return;

    sendEvent(
      "player",
      JSON.stringify({
        position: camera.position
          .toArray()
          .map((p) => parseFloat(p.toPrecision(3))),
        rotation: camera.rotation
          .toArray()
          .slice(0, 3)
          .map((r) => parseFloat(r.toPrecision(3))),
      })
    );
  });
};
