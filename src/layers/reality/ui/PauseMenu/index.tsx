import { useMemo } from "react";
import { useEnvironment } from "../../layers";
import { useKeyboardLayout } from "../../utils";
import { Idea } from "../../../basis";
import { MenuItem } from "../../types";
import {
  Actions,
  ClickContainer,
  Container,
  Continue,
  Instructions,
  MenuButton,
  MenuLink,
  Title,
  Window,
} from "./components/components";

type PauseItem = Omit<MenuItem, "action"> & {
  action?: () => void;
  link?: string;
};

type PauseMenuProps = {
  title?: string;
  pauseMenuItems?: PauseItem[];
  dev?: boolean;
};

export default function PauseMenu(props: PauseMenuProps) {
  const { title = "spacesvr", pauseMenuItems = [], dev = false } = props;

  const { paused, overlay, setPaused, menuItems, device } = useEnvironment();
  const layout = useKeyboardLayout();

  const closeOverlay = () => setPaused(false);
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
    ...pauseMenuItems,
    {
      text: "v1.9.2",
      link: "https://www.npmjs.com/package/spacesvr",
    },
    ...menuItems,
  ];

  return (
    <Container paused={paused}>
      <ClickContainer onClick={closeOverlay} />
      <Window>
        <Title>{title}</Title>
        <Instructions>
          <p>Move – {device.mobile ? "Joystick" : layout}</p>
          <p>Look – {device.mobile ? "Drag" : "Mouse"}</p>
          <p>Pause – {device.mobile ? "Menu Button" : "Esc"}</p>
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
      </Window>
      <Continue onClick={closeOverlay} color={continueIdea.getHex()}>
        continue
      </Continue>
    </Container>
  );
}
