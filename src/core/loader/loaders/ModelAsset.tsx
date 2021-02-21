import { useContext, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { DRACO_URL } from "../../../services/constants";
import { LoadingContext } from "../../contexts";
import { ref } from "valtio";

type Props = {
  url: string;
};

const ModelAsset = (props: Props) => {
  const { url } = props;
  const { assets } = useContext(LoadingContext);

  const gltf = useGLTF(url, DRACO_URL);

  useEffect(() => {
    if (gltf) {
      assets[url].loaded = true;
      assets[url].data = ref(gltf);
    }
  }, [gltf]);

  return null;
};

export default ModelAsset;
