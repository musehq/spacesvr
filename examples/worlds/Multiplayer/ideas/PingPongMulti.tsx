import { useNetwork } from "spacesvr";
import { useEffect } from "react";

export default function PingPongMulti() {
  const { voice, setVoice } = useNetwork();

  useEffect(() => {
    setTimeout(() => {
      console.log("setting to ", !voice);
      setVoice(!voice);
    }, 5000);
  }, [setVoice, voice]);

  return null;
}
