import { useEffect, useMemo, useRef, useState } from "react";
import { usePlayer } from "../layers/Player";
import { useEnvironment } from "../layers/Environment";
import { Vector3 } from "three";
import { isTyping } from "./dom";
import { useRerender } from "./rerender";

export const useHTMLInput = (type: "file" | "text"): HTMLInputElement => {
  const input = useMemo(() => {
    const inp = document.createElement("input");
    document.body.appendChild(inp);
    return inp;
  }, []);

  useEffect(() => {
    input.setAttribute("type", type);
    input.style.zIndex = "-99";
    input.style.opacity = "0";
    input.style.fontSize = "16px"; // this disables zoom on mobile
    input.style.position = "absolute";
    input.style.left = "50%";
    input.style.top = "0";
    input.style.transform = "translate(-50%, 0%)";
  }, [input, type]);

  useEffect(() => {
    return () => {
      document.body.removeChild(input);
    };
  }, [input]);

  return input;
};

export const useTextInput = (
  value: string,
  setValue: (s: string) => void,
  onChange?: (s: string) => string
) => {
  const input = useHTMLInput("text");

  const { paused } = useEnvironment();
  const { controls, velocity } = usePlayer();

  const rerender = useRerender();
  const [focused, setFocused] = useState(false);
  const protectClick = useRef(false); // used to click off of the input to blur

  // input setup
  useEffect(() => {
    input.addEventListener("focus", () => setFocused(true));
    input.addEventListener("blur", () => setFocused(false));
    input.autocomplete = "off";
  }, [input]);

  // blur on pause
  useEffect(() => {
    if (focused && paused) input.blur();
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
    const onDocClick = () => {
      if (!protectClick.current) input.blur();
      else input.focus();
      protectClick.current = false;
    };

    const onKeyup = () => {
      if (input !== document.activeElement) return;
      if (onChange) input.value = onChange(input.value);
      setValue(input.value);
    };

    const onSelectionChange = () => {
      if (input !== document.activeElement) return;
      rerender();
    };

    document.addEventListener("click", onDocClick);
    input.addEventListener("input", onKeyup);
    document.addEventListener("selectionchange", onSelectionChange);

    return () => {
      document.removeEventListener("click", onDocClick);
      input.removeEventListener("input", onKeyup);
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, [input, onChange, rerender, setValue]);

  // keep the input's value in sync with the passed state value
  useEffect(() => {
    input.value = value;
  }, [input, value]);

  const focusInput = () => {
    protectClick.current = true;
    input.focus();
  };

  return { input, focused, focusInput };
};
