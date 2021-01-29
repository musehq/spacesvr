import styled from "@emotion/styled";
import { Canvas } from "react-three-fiber";
import { OrbitControls } from "@react-three/drei";
import Effects from "./components/Effects";
import MeshParticles from "./components/MeshParticles";
import { Background } from "../../../components";
import FlyControls from "../../controls/FlyControls";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 200;

  & > * > canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const LoadingScreen = () => {
  return (
    <Container>
      <Canvas
        concurrent
        gl={{ alpha: true }}
        camera={{ position: [0, 15, 0], near: 0.01, far: 150 }}
      >
        <FlyControls />
        <Effects />
        <ambientLight />
        <Background color={"white"} />
        <MeshParticles count={5000} />
      </Canvas>
    </Container>
  );
};

export default LoadingScreen;
