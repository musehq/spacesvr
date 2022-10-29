import dynamic from "next/dynamic";

const Media = dynamic(import("../worlds/Media"), { ssr: false });

export default function Index() {
  return <Media />;
}
