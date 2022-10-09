import { LostWorld, StandardReality, Image } from "spacesvr";
import Link from "../ideas/Link";
import Title from "../ideas/Title";

export default function Hub() {
  return (
    <StandardReality
      environmentProps={{ dev: process.env.NODE_ENV === "development" }}
    >
      <LostWorld />
      <group position-z={-1.5}>
        <Title position-y={1.2}>welcome to spacesvr</Title>
        <group position-y={0.8}>
          <Link href="/multiplayer" position-x={-1}>
            test out multiplayer
          </Link>
          <Link href="/media">test out media</Link>
          <Link href="/workshop" position-x={1}>
            visit the workshop
          </Link>
        </group>
        <Image
          scale={18}
          position-y={0.025}
          rotation-x={-Math.PI / 2}
          src="https://d27rt3a60hh1lx.cloudfront.net/spacesvr/spacesvr.png"
        />
      </group>
    </StandardReality>
  );
}
