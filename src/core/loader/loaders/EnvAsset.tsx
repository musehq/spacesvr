import { useContext, useEffect } from "react";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { UnsignedByteType } from "three";
import { LoadingContext } from "../../contexts";
import { ref } from "valtio";

type Props = {
  url: string;
};

const EnvAsset = (props: Props) => {
  const { url } = props;
  const { assets } = useContext(LoadingContext);

  const loader = new RGBELoader();
  loader.setDataType(UnsignedByteType);

  useEffect(() => {
    loader.load(url, (texture) => {
      assets[url].loaded = true;
      assets[url].data = ref(texture);
    });
  }, [loader]);

  return null;
};

export default EnvAsset;
