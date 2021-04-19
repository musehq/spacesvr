import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

export function AdaptiveDPR() {
  const current = useThree((state) => state.performance.current);
  const setDpr = useThree((state) => state.setDpr);
  useEffect(() => {
    setDpr(current * 2);
    document.body.style.imageRendering = current === 1 ? "auto" : "pixelated";
    console.log(`setting dpr to ${current * 2}`);
  }, [current]);
  return null;
}
