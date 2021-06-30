import { TextInput } from "../../TextInput";
import React, { useState } from "react";
import { FileInput } from "../../FileInput";

export function PropsHandler() {
  const [value, setValue] = useState<string>("");

  return (
    <group position={[0.25, 0.25, 0]}>
      <FileInput
        value={value}
        setValue={setValue}
        position-y={-1}
        scale={3}
        name="input"
      />
    </group>
  );
}
