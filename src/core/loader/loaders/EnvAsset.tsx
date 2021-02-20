import { useEffect } from "react";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { UnsignedByteType } from "three";
import { Assets } from "../../types/loading";

type Props = {
  url: string;
  assets: Assets;
};

const EnvAsset = (props: Props) => {
  const { url, assets } = props;

  const loader = new RGBELoader();
  loader.setDataType(UnsignedByteType);

  useEffect(() => {
    loader.load(url, (texture) => {
      assets[url].loaded = true;
      assets[url].data = texture;
    });
  }, [loader]);

  return null;
};

export default EnvAsset;
