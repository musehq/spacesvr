import { ReactNode } from "react";
import { useMemory } from "../../layers/Memory";

export default function layer(node: ReactNode) {
  const memory = useMemory();

  return node;
}
