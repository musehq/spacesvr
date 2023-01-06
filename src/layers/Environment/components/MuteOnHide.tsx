import { useEffect } from "react";
import { AudioContext } from "three";

export default function MuteOnHide() {
  useEffect(() => {
    document.addEventListener("visibilitychange", function (event) {
      const context = AudioContext.getContext();
      if (document.hidden) context.suspend();
      else context.resume();
    });
  }, []);

  return null;
}
