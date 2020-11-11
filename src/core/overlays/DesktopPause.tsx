import styled from "@emotion/styled";
import { isMobile } from "react-device-detect";
import { useEnvironment } from "../index";

const { NEXT_PUBLIC_VERSION } = process.env;

const Container = styled.div<{ paused: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  transition: opacity 0.25s ease;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  opacity: ${(props) => (props.paused ? 1 : 0)};
  pointer-events: ${(props) => (props.paused ? "all" : "none")};
`;

const ClickContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`;

const Window = styled.div`
  width: 90%;
  max-width: 400px;
  height: 91vw;
  max-height: 400px;
  padding: 20px 20px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 3%;
  background-image: url("https://spaces-gallery-assets.s3-us-west-1.amazonaws.com/images/pauseMenuBg.png");
  background-position: center;
  background-size: cover;
`;

const Continue = styled.div`
  width: 90%;
  max-width: 400px;
  height: auto;
  cursor: pointer;
  text-align: center;
  font-size: 1.3em;
  font-family: "Lato", sans-serif;
  transition: opacity 0.15s linear;
  margin-top: 20px;
  background: white;
  line-height: 1em;
  padding: 12px 0;
  border-radius: 10px;
  :hover {
    opacity: 0.5;
  }
`;

const Version = styled.a`
  position: absolute;
  top: 24px;
  right: 60px;
  font-size: 0.6em;
`;

const Instagram = styled.div`
  position: absolute;
  top: 24px;
  left: 60px;
  width: auto;
  height: auto;
  color: white;
  cursor: pointer;
  transition: opacity 0.15s linear;
  font-size: 0.6em;
  line-height: 1em;
  :hover {
    opacity: 0.5;
  }
`;

const Header = styled.div`
  margin-top: 8%;
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Lato", sans-serif;
`;

const Title = styled.div`
  font-size: 2em;
  text-align: center;
  margin-bottom: 0em;
  line-height: 1em;
`;

const Text = styled.div`
  width: 100%;
  height: auto;
  margin: 10px 0;
  font-family: "Space Mono", monospace;
  font-size: 0.7em;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const DesktopPause = () => {
  const { paused, overlay, setPaused } = useEnvironment();
  const closeOverlay = () => setPaused(false);

  if (overlay) {
    return null;
  }

  return (
    <Container paused={paused}>
      <ClickContainer onClick={closeOverlay} />
      <Window>
        <Version>v {NEXT_PUBLIC_VERSION}</Version>
        <Instagram
          onClick={() => {
            window.open("https://www.instagram.com/spaces3.0");
          }}
        >
          @spaces3.0
        </Instagram>
        <Header>
          <Title>SPACES</Title>
        </Header>
        <Text>
          <p>Move around: {isMobile ? "Joystick" : "W/A/S/D"}</p>
          <p>Look around: {isMobile ? "Drag" : "Mouse"}</p>
          <p>Pause: {isMobile ? "Menu Button" : "Esc"}</p>
        </Text>
      </Window>
      <Continue onClick={closeOverlay}>continue</Continue>
    </Container>
  );
};

export default DesktopPause;
