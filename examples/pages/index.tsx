import dynamic from "next/dynamic";

const Lost = dynamic(import("../worlds/Lost"), { ssr: false });

export default function Index() {
  return <Lost />;
}
