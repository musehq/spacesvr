import { GroupProps, useFrame } from "@react-three/fiber";
import { Interactable, useNetwork } from "spacesvr";
import { useState } from "react";

export default function LightSwitch(props: GroupProps) {
  const { useChannel } = useNetwork();

  const [on, setOn] = useState(false);

  const switchChannel = useChannel("light-switch", "sync", (m, s) => {
    if (m.data.on === undefined) return;
    s.on = m.data.on;
  });

  const onClick = () => {
    switchChannel.send({ on: !switchChannel.state.on });
  };

  useFrame(() => {
    if (on !== Boolean(switchChannel.state.on)) {
      setOn(Boolean(switchChannel.state.on));
    }
  });

  return (
    <group name="switch" {...props}>
      <Interactable onClick={onClick}>
        <mesh>
          <boxBufferGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color={on ? "yellow" : "#222"} />
        </mesh>
      </Interactable>
    </group>
  );
}
