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
        <Title
          position-y={1.2}
          image="https://d27rt3a60hh1lx.cloudfront.net/spacesvr/spacesvr.png"
        >
          welcome to spacesvr
        </Title>
        <group position-y={0.8}>
          <Link href="/multiplayer" position-x={-2}>
            visit multiplayer page
          </Link>
          <Link href="/media" position-x={-1}>
            visit media page
          </Link>
          <Link href="/workshop" position-x={1}>
            visit workshop page
          </Link>
          <Link href="https://github.com/musehq/spacesvr" position-x={2}>
            visit github
          </Link>
        </group>
      </group>
    </StandardReality>
  );
}
