import { useVisual } from "../../layers/Visual";
import { ReactElement, useEffect, useState } from "react";

type VisualEffect = {
  index: number;
  children: ReactElement | ReactElement[];
};

export function VisualEffect(props: VisualEffect) {
  const { index, children } = props;

  const [uuid] = useState(() => Math.random().toString(36).substring(2));
  const { registerPass, unregisterPass } = useVisual();

  useEffect(() => {
    if (!children) return;
    if (!Array.isArray(children)) {
      registerPass({ uuid, node: children, index });
    } else {
      children.forEach((child, i) => {
        registerPass({ uuid, node: child, index: i });
      });
    }
    return () => unregisterPass(uuid);
  }, [children, index, registerPass, unregisterPass, uuid]);

  return null;
}
