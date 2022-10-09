import dynamic from "next/dynamic";

const Workshop = dynamic(import("../worlds/Workshop"), { ssr: false });

export default function Index() {
  return <Workshop />;
}
