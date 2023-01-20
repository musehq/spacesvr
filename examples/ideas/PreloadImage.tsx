import { useState } from "react";
import { Image, useImage, useKeypress } from "spacesvr";

const IMAGE_URL =
  "https://d1htv66kutdwsl.cloudfront.net/e7edec86-52b6-4734-9c43-ffd70bc5bef6/9d1e5c18-3fb5-4844-8b31-1a08b800976e.ktx2";

export default function PreloadImage() {
  const [mounted, setMounted] = useState(false);
  useKeypress("m", () => setMounted(!mounted), [mounted]);

  if (!mounted) return null;

  return (
    <Image
      src={IMAGE_URL}
      framed
      frameWidth={0.75}
      size={12}
      rotation-y={0}
      position={[-1.4, 1.5, -12]}
    />
  );
}

useImage.preload(IMAGE_URL);
