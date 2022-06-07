import dynamic from "next/dynamic";

const Styled = dynamic(import("../worlds/Styled"), { ssr: false });

export default function Index() {
  return <Styled />;
}
