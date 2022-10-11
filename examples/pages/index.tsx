import dynamic from "next/dynamic";

const Hub = dynamic(import("../worlds/Hub"), { ssr: false });

export default function Index() {
  return <Hub />;
}
