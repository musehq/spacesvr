import { LostWorld, StandardReality, TextInput } from "spacesvr";
import { useState } from "react";
import { GroupProps } from "@react-three/fiber";

function DummyText(props: GroupProps) {
  const [val, setVal] = useState("");

  return <TextInput position-y={0.9} {...props} />;
}

export default function Lost() {
  return (
    <StandardReality
      environmentProps={{ dev: process.env.NODE_ENV === "development" }}
    >
      <LostWorld />
      {new Array(1).fill("1").map((_, i) => (
        <DummyText key={i} position-x={1.15 * i} />
      ))}
      {/*<mesh position-y={0.9 / 2 + 0.01}>*/}
      {/*  <boxBufferGeometry args={[0.125, 0.9, 0.125]} />*/}
      {/*  <meshStandardMaterial color="red" />*/}
      {/*</mesh>*/}
    </StandardReality>
  );
}
