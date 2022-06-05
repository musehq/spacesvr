import {
  StandardReality,
  Background,
  useNetwork,
  Interactable,
} from "spacesvr";
import { useState } from "react";
import { useFrame } from "@react-three/fiber";

export default () => {
  return (
    <StandardReality
      playerProps={{ pos: [5, 1, 0], rot: Math.PI }}
      networkProps={{
        host: "https://muse-web-pr-49.onrender.com",
        autoconnect: true,
      }}
    >
      <Background color={0xffffff} />
      <fog attach="fog" args={[0xffffff, 10, 90]} />
      <ambientLight />
      <LightSwitch position={[0.5, 1, -2.5]} />
      <mesh rotation-x={-Math.PI / 2}>
        <planeBufferGeometry args={[200, 200]} />
        <meshBasicMaterial color={"purple"} />
      </mesh>
    </StandardReality>
  );
};

function LightSwitch(props) {
  const { useChannel } = useNetwork();

  const [on, setOn] = useState(false);

  const switchChannel = useChannel("light-switch", "sync", (m, s) => {
    if (m.data.on === undefined) return;
    s.on = m.data.on;
  });

  const onClick = () => {
    switchChannel.send({ on: !Boolean(switchChannel.state.on) });
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
