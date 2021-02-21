import { useContext, useEffect } from "react";
import { useTexture } from "@react-three/drei";
import { LoadingContext } from "../../contexts";
import { ref } from "valtio";

type Props = {
  url: string;
};

const ImageAsset = (props: Props) => {
  const { url } = props;
  const { assets } = useContext(LoadingContext);

  const texture = useTexture(url);

  useEffect(() => {
    if (texture) {
      assets[url].loaded = true;
      assets[url].data = ref(texture);
    }
  }, [texture]);

  return null;
};

export default ImageAsset;
