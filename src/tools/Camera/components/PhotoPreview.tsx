import { Photography } from "../logic/photo";
import { Html } from "@react-three/drei";
import { createPortal } from "react-dom";
import { useEnvironment } from "../../../layers";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  z-index: 10;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 25px 25px 30px;
  box-sizing: border-box;
  background: black;
  width: 90vw;
`;

const Background = styled.div`
  position: absolute;
  z-index: 9;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: black;
  opacity: 0.6;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;

const Text = styled.p`
  color: white;
  text-align: center;
  font-size: 1.15rem;
`;

const Button = styled.button`
  background: white;
  border: none;
  color: black;
  padding: 10px 20px;
  font-size: 1rem;
  font-family: inherit;
  border-radius: 10px;
  font-weight: bold;
  margin: 0 auto;
`;

type PhotoPreview = {
  photo: Photography;
};

export default function PhotoPreview(props: PhotoPreview) {
  const { photo } = props;

  const { containerRef, device } = useEnvironment();

  if (!photo.data.value || !containerRef.current || !device.mobile) return null;

  return (
    <Html>
      {createPortal(
        <>
          <Wrapper>
            <Image src={photo.data.value} />
            <Text>press and hold the image to save it</Text>
            <Button onClick={() => photo.data.set(undefined)}>close</Button>
          </Wrapper>
          <Background />
        </>,
        containerRef.current
      )}
    </Html>
  );
}
