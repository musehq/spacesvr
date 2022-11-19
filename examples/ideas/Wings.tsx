import { useEffect, useState } from "react";
import { usePlayer, isTyping } from "spacesvr";
import { Vector3 } from "three";

export default function Wings() {
  const { velocity } = usePlayer();

  const [dummy] = useState(() => new Vector3());

  useEffect(() => {
    const jump = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === " " && !isTyping() && !e.metaKey) {
        dummy.copy(velocity.get());
        dummy.y = 5;
        velocity.set(dummy);
      }
    };

    document.addEventListener("keypress", jump);
    return () => {
      document.removeEventListener("keypress", jump);
    };
  }, [dummy, velocity]);

  return null;
}
