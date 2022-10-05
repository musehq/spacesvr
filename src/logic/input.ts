import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../layers/Player";
import { useEnvironment } from "../layers/Environment";
import { Vector3 } from "three";
import { isTyping } from "./dom";
import { useThree } from "@react-three/fiber";

export const useHTMLInput = (
  type: "file" | "text"
): HTMLInputElement | undefined => {
  const [input, setInput] = useState<HTMLInputElement>();

  useEffect(() => {
    if (!input) {
      const inp = document.createElement("input");
      inp.setAttribute("type", type);
      inp.style.zIndex = "-99";
      inp.style.opacity = "0";
      inp.style.fontSize = "16px"; // this disables zoom on mobile
      inp.style.position = "absolute";
      inp.style.left = "50%";
      inp.style.top = "0";
      inp.style.transform = "translate(-50%, 0%)";

      document.body.appendChild(inp);

      setInput(inp);
    }
  }, [input, type]);

  return input;
};

export const useTextInput = (
  value: string,
  setValue: (s: string) => void,
  onChange?: (s: string) => string
) => {
  const input = useHTMLInput("text");

  const gl = useThree((st) => st.gl);
  const { paused } = useEnvironment();
  const { controls, velocity } = usePlayer();

  const [selection, setSelection] = useState<[number | null, number | null]>([
    null,
    null,
  ]);
  const [focused, setFocused] = useState(false);
  const protectClick = useRef(false); // used to click off of the input to blur

  // input setup
  useEffect(() => {
    if (!input) return;

    input.addEventListener("focus", () => {
      setFocused(true);
      setSelection([input.selectionStart, input.selectionEnd]);
    });
    input.addEventListener("blur", () => {
      setFocused(false);
      setSelection([null, null]);
    });

    input.autocomplete = "off";
    setSelection([0, null]);
  }, [input]);

  // blur on pause
  useEffect(() => {
    if (input && focused && paused) input.blur();
  }, [input, focused, paused]);

  // stop player from moving while they type (free up wasd)
  useEffect(() => {
    if (focused) {
      velocity.set(new Vector3());
      controls.lock();
    } else if (!isTyping()) {
      velocity.set(new Vector3());
      controls.unlock();
    }
  }, [focused, velocity, controls]);

  // set up event listeners
  useEffect(() => {
    // blur on clicking outside of input
    const onDocClick = () => {
      if (input) {
        if (!protectClick.current) input.blur();
        else input.focus();
      }
      protectClick.current = false;
    };

    // keyup event
    const onKeyup = () => {
      if (!focused || !input) return;
      if (onChange) input.value = onChange(input.value);
      setSelection([input.selectionStart, input.selectionEnd]);
      setValue(input.value);
    };

    const onSelectionChange = () => {
      if (!input) return;
      setSelection([input.selectionStart, input.selectionEnd]);
    };

    document.addEventListener("click", onDocClick);
    if (input) input.addEventListener("input", onKeyup);
    document.addEventListener("selectionchange", onSelectionChange);

    return () => {
      document.removeEventListener("click", onDocClick);
      if (input) input.removeEventListener("input", onKeyup);
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, [focused, input, controls, setValue, onChange, gl.domElement]);

  // keep the input's value in sync with the passed state value
  // useEffect(() => {
  //   if (!input) return;
  //   input.value = value || "";
  // }, [value, input]);

  const focusInput = () => {
    if (!input) return;
    protectClick.current = true;
    input.focus();
  };

  return { input, focused, selection, focusInput };
};
