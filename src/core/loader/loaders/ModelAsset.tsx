import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { DRACO_URL } from "../../../services/constants";
import { Assets } from "../../types/loading";

type Props = {
  url: string;
  assets: Assets;
};

const ModelAsset = (props: Props) => {
  const { url, assets } = props;

  const gltf = useGLTF(url, DRACO_URL);

  useEffect(() => {
    if (gltf) {
      assets[url].loaded = true;
      assets[url].data = gltf;
    }
  }, [gltf]);

  return null;
};

export default ModelAsset;
