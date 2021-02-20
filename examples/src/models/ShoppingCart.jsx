import { DRACO_URL } from "../../../src/services";
import { useGLTF } from "@react-three/drei";

const Building = () => {
  const gltf = useGLTF(
    "https://d27rt3a60hh1lx.cloudfront.net/models/ShoppingCart-1613286474/cart2.glb",
    DRACO_URL
  );

  return <primitive object={gltf.scene} />;
};

export default Building;
