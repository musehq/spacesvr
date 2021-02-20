import { useEffect } from "react";
import { useTexture } from "@react-three/drei";
import { Assets } from "../../types/loading";

type Props = {
  url: string;
  assets: Assets;
};

const ImageAsset = (props: Props) => {
  const { url, assets } = props;

  const texture = useTexture(url);

  useEffect(() => {
    if (texture) {
      assets[url].loaded = true;
      assets[url].data = texture;
    }
  }, [texture]);

  return null;
};

export default ImageAsset;
