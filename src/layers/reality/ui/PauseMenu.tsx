import styled from "@emotion/styled";
import { isMobile } from "react-device-detect";
import { useEnvironment } from "../layers/environment";
import { useKeyboardLayout } from "../utils/hooks";
import { MenuItem } from "../types";
import { useMemo } from "react";
import { Idea } from "../../basis";

const Container = styled.div<{ paused: boolean; dev?: boolean }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  transition: opacity 0.25s ease;
  background: rgba(0, 0, 0, ${(props) => (props.dev ? 0 : 0.25)});
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  opacity: ${(props) => (props.paused ? 1 : 0)};
  pointer-events: ${(props) => (props.paused ? "all" : "none")};
  font-family: "Quicksand", sans-serif;
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
  padding: 20px 20px;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 10px;
  background-color: white;
  //border: 2px solid black;
  background-position: center;
  background-size: cover;
  box-sizing: border-box;

  box-shadow: 12px 12px 16px 0 rgba(0, 0, 0, 0.25),
    -8px -8px 12px 0 rgba(255, 255, 255, 0.3);
`;

const Continue = styled.div<{ color: string }>`
  width: 90%;
  max-width: 400px;
  height: auto;
  cursor: pointer;
  text-align: center;
  font-size: 1.3em;
  font-family: "Quicksand", sans-serif;
  transition: opacity 0.15s linear;
  margin-top: 20px;
  background: ${(props) => props.color};
  color: white;
  //border: 2px solid black;
  line-height: 1em;
  padding: 12px 0;
  border-radius: 10px;
  :hover {
    opacity: 0.5;
  }

  box-shadow: 12px 12px 16px 0 rgba(0, 0, 0, 0.25),
    -8px -8px 12px 0 rgba(255, 255, 255, 0.3);
`;

const Footer = styled.div`
  margin-top: 15px;
  width: 100%;
  text-align: center;
  font-size: 0.75rem;
  font-family: "Quicksand", sans-serif;

  & > a {
    color: #333;
    line-height: 1em;
    transition: opacity 0.15s linear;

    :hover {
      opacity: 0.5;
    }
  }
`;

const Logo = styled.img`
  height: 0.8em;
  vertical-align: middle;
  margin-right: 15px;
`;

const Instructions = styled.div`
  width: 100%;
  height: auto;
  margin: 30px 0;
  font-size: 0.7em;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  & > p {
    margin: 0.2em;
  }
`;

const MenuButton = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0);
  padding: 5px 10px;
  margin: 8px 4px;
  transition: background 0.15s linear;
  font-size: 0.5em;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.15);
  }
`;

const MenuLink = styled.a`
  border: 1px solid black;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0);
  padding: 5px 10px;
  margin: 8px 4px;
  transition: background 0.15s linear;
  font-size: 0.5em;
  cursor: pointer;
  text-decoration: none;
  color: black !important;

  &:hover {
    background: rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h1`
  margin: 0;
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

type PauseItem = MenuItem & {
  link?: string;
};

type PauseMenuProps = {
  dev: boolean;
};

export default function PauseMenu(props: PauseMenuProps) {
  const { dev } = props;
  const { paused, overlay, setPaused, menuItems } = useEnvironment();
  const layout = useKeyboardLayout();
  const closeOverlay = () => setPaused(false);

  const cta = useCTA();

  const continueIdea = useMemo(
    () => new Idea().setFromCreation(Math.random(), 0.8, 0.95),
    []
  );

  if (dev) {
    return (
      <Container paused={paused} dev={true}>
        <ClickContainer onClick={closeOverlay} />
      </Container>
    );
  }

  if (overlay) {
    return null;
  }

  const PAUSE_ITEMS: PauseItem[] = [
    {
      text: cta,
      action: () => {
        console.log("");
      },
      link: `https://muse.place?utm_source=pause_menu&utm_campaign=${encodeURIComponent(
        cta
      )}`,
    },
    {
      text: "v1.8.11",
      action: () => {
        console.log("");
      },
      link: "https://www.npmjs.com/package/spacesvr",
    },
    ...menuItems,
  ];

  return (
    <Container paused={paused}>
      <ClickContainer onClick={closeOverlay} />
      <Window>
        <Title>
          <Logo src="https://d27rt3a60hh1lx.cloudfront.net/images/muselogogray.png" />
          muse
        </Title>
        <Instructions>
          <p>Move – {isMobile ? "Joystick" : layout}</p>
          <p>Look – {isMobile ? "Drag" : "Mouse"}</p>
          <p>Pause – {isMobile ? "Menu Button" : "Esc"}</p>
        </Instructions>
        <Actions>
          {PAUSE_ITEMS.map((item) =>
            item.link ? (
              <MenuLink key={item.text} href={item.link}>
                {item.text}
              </MenuLink>
            ) : (
              <MenuButton key={item.text} onClick={item.action}>
                {item.text}
              </MenuButton>
            )
          )}
        </Actions>
        <Footer>
          <a
            href="https://spaces-gallery-assets.s3.us-west-1.amazonaws.com/legal/musetermsofservice.pdf"
            target="_blank"
            rel="noreferrer"
          >
            terms and conditions
          </a>
          &nbsp;&nbsp;•&nbsp;&nbsp;
          <a
            href="https://spaces-gallery-assets.s3.us-west-1.amazonaws.com/legal/museprivacypolicy.pdf"
            target="_blank"
            rel="noreferrer"
          >
            privacy policy
          </a>
        </Footer>
      </Window>
      <Continue onClick={closeOverlay} color={continueIdea.getHex()}>
        continue
      </Continue>
    </Container>
  );
}

const useCTA = (): string => {
  const options = ["Build a World", "Build Now", "Muse HQ", "www.muse.place"];
  return useMemo(() => options[Math.floor(Math.random() * options.length)], []);
};
