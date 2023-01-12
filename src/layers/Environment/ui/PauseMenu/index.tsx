import { useCallback, useMemo } from "react";
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
import { useKeyboardLayout } from "../../../../logic/keyboard";
import { MenuItem, useEnvironment } from "../../logic/environment";
import { Idea } from "../../../../logic/basis";

type PauseMenuProps = {
  title?: string;
  pauseMenuItems?: MenuItem[];
  dev?: boolean;
};

export default function PauseMenu(props: PauseMenuProps) {
  const { title = "spacesvr", pauseMenuItems = [], dev = false } = props;

  const { paused, setPaused, menuItems, device } = useEnvironment();
  const layout = useKeyboardLayout();

  const closeOverlay = useCallback(() => {
    const item = menuItems.find((item) => item.text === "Enter VR");
    if (item && item.action) item.action();
    else setPaused(false);
  }, [menuItems, setPaused]);

  const hex = useMemo(
    () => new Idea().setFromCreation(Math.random(), 0.8, 0.95).getHex(),
    []
  );

  const PAUSE_ITEMS: MenuItem[] = [
    ...pauseMenuItems,
    {
      text: "v2.10.0",
      link: "https://www.npmjs.com/package/spacesvr",
    },
    ...menuItems,
  ];

  return (
    <Container paused={paused} dev={dev}>
      <ClickContainer onClick={closeOverlay} />
      {!dev && (
        <>
          <Window>
            <Title>{title}</Title>
            <Instructions>
              <p>Move – {device.mobile ? "Joystick" : layout}</p>
              <p>Look – {device.mobile ? "Drag" : "Mouse"}</p>
              <p>Pause – {device.mobile ? "Menu Button" : "Esc"}</p>
              <p>Cycle Tool – {device.mobile ? "Edge Swipe" : "Tab"}</p>
            </Instructions>
            <Actions>
              {PAUSE_ITEMS.map((item) =>
                item.link ? (
                  <MenuLink key={item.text} href={item.link} target="_blank">
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
          <Continue onClick={closeOverlay} color={hex}>
            continue
          </Continue>
        </>
      )}
    </Container>
  );
}
