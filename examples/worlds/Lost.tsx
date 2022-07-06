import { LostWorld, StandardReality } from "spacesvr";

export default function Lost() {
  return (
    <StandardReality
      environmentProps={{ dev: process.env.NODE_ENV === "development" }}
    >
      <LostWorld />
    </StandardReality>
  );
}
