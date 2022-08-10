import { Tool } from "../../../ideas/modifiers/Tool";
import { AudioListener } from "three";
import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";

export default function Config() {
  const [muted, setMuted] = useState(false);
  const scene = useThree((st) => st.scene);

  const [volume, setVolume] = useState(1);

  const setVol = (vol: number) => {
    scene.traverse((child) => {
      if (child instanceof AudioListener) {
        (child as AudioListener).setMasterVolume(vol);
      }
    });
  };

  useEffect(() => {
    if (muted) setVol(0);
    else setVol(volume);
  }, [muted, scene, setVol, volume]);

  useEffect(() => {
    const ev = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "m") setMuted(!muted);
      if (e.code === "ArrowDown") setVolume(Math.max(0, volume - 0.1));
      if (e.code === "ArrowUp") setVolume(Math.min(1, volume + 0.1));
    };
    document.addEventListener("keydown", ev);
    return () => document.removeEventListener("keydown", ev);
  }, [muted, volume]);

  return (
    <Tool face pos={[0.65, -0.75]}>
      <mesh>
        <boxBufferGeometry args={[2, 0.4, 0.1]} />
        <meshStandardMaterial color={muted ? "red" : "blue"} />
      </mesh>
    </Tool>
  );
}
