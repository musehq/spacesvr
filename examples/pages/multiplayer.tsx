import dynamic from "next/dynamic";

const Multiplayer = dynamic(import("../worlds/Multiplayer"), { ssr: false });

export default function Index() {
  return <Multiplayer />;
}
