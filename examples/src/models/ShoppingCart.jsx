import { DRACO_URL } from "../../../src/utils";
import { useGLTF } from "@react-three/drei";
import { useTrimeshCollision } from "../../../src/utils/";

const Building = () => {
  const gltf = useGLTF(
    "https://d27rt3a60hh1lx.cloudfront.net/models/ShoppingCart-1613286474/cart2.glb",
    DRACO_URL
  );

  useTrimeshCollision(gltf.nodes.Metal.geometry.clone());

  return <primitive object={gltf.scene} />;
};

export default Building;
