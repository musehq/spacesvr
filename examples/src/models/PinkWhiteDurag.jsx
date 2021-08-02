import { DRACO_URL } from "../../../src/utils";
import { useGLTF } from "@react-three/drei";

const PinkWhiteDurag = () => {
  const gltf = useGLTF(
    "https://d27rt3a60hh1lx.cloudfront.net/models/PinkWhiteDurag-1613279207/pinkwhitedurag5.glb",
    DRACO_URL
  );

  return <primitive object={gltf.scene} />;
};

export default PinkWhiteDurag;
