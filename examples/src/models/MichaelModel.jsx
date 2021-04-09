import { DRACO_URL } from "../../../src/services";
import { useGLTF } from "@react-three/drei";

const MichaelModel = (props) => {
  const gltf = useGLTF(
    "https://d27rt3a60hh1lx.cloudfront.net/models/Michael-1613184104/michael1.glb",
    DRACO_URL
  );

  return (
    <group {...props}>
      <primitive object={gltf.scene} />
    </group>
  );
};

export default MichaelModel;
