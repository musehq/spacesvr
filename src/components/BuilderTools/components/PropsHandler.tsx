import React from "react";
import { FileInput } from "../../FileInput";

export function PropsHandler(props: { open: boolean }) {
  const { open } = props;

  return (
    <group position={[0.25, 0.25, 0]}>
      <FileInput open={open} position-y={-1} scale={3} name="input" />
    </group>
  );
}
