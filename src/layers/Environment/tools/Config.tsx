import { Tool } from "../../../ideas/modifiers/Tool";
import { AudioListener } from "three";
import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";

export default function Config() {
  const [muted, setMuted] = useState(false);
  const scene = useThree((st) => st.scene);

  useEffect(() => {
    if (muted) {
      scene.traverse((child) => {
        if (child instanceof AudioListener) {
          (child as AudioListener).setMasterVolume(0);
        }
      });
    } else {
      scene.traverse((child) => {
        if (child instanceof AudioListener) {
          (child as AudioListener).setMasterVolume(1);
        }
      });
    }
  }, [muted, scene]);

  useEffect(() => {
    const toggle = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "m") return;
      setMuted(!muted);
    };
    document.addEventListener("keydown", toggle);
    return () => document.removeEventListener("keydown", toggle);
  }, [muted]);

  return (
    <Tool face pos={[0.65, -0.75]}>
      <mesh>
        <boxBufferGeometry args={[2, 0.4, 0.1]} />
        <meshStandardMaterial color={muted ? "red" : "blue"} />
      </mesh>
    </Tool>
  );
}
