import { Group } from "three";
import { useEffect, useRef, useState } from "react";
import { Idea } from "../../../components/Idea";
import { Floating } from "../../../modifiers/Floating";
import Menu from "./components/Menu";

const PauseMenu = () => {
  const group = useRef<Group>();

  const [open, setOpen] = useState(true);

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "l") {
      setOpen(!open);
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", onKeyPress);
    return () => {
      window.removeEventListener("keypress", onKeyPress);
    };
  }, [open]);

  return (
    <group>
      <Floating height={1}>
        <group>
          <Idea size={2} />
          <Menu position-x={2} position-y={-2} />
        </group>
      </Floating>
    </group>
  );
};

export default PauseMenu;
