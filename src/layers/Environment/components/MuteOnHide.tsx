import { useEffect } from "react";
import { AudioContext } from "three";

export default function MuteOnHide() {
  useEffect(() => {
    function handleChange() {
      const context = AudioContext.getContext();
      if (document.hidden) context.suspend();
      else context.resume();
    }

    document.addEventListener("visibilitychange", handleChange);
    return () => document.removeEventListener("visibilitychange", handleChange);
  }, []);

  return null;
}
