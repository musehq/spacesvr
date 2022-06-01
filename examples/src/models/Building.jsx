import { DRACO_URL } from "../../../src/logic";
import { useGLTF } from "@react-three/drei";

const Building = () => {
  const gltf = useGLTF(
    "https://d27rt3a60hh1lx.cloudfront.net/models/C2ABuilding-1613786912/building.glb",
    DRACO_URL
  );

  return <primitive object={gltf.scene} />;
};

export default Building;
