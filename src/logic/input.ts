import { useEffect, useMemo, useRef, useState } from "react";
import { usePlayer } from "../layers/Player";
import { useEnvironment } from "../layers/Environment";
import { Vector3 } from "three";
import { isTyping } from "./dom";
import { useRerender } from "./rerender";

export const useHTMLInput = (
  type: "file" | "text" | "password"
): HTMLInputElement => {
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
  type: "text" | "password" | "number",
  value: string,
  onChange: (s: string) => void
) => {
  // number isn't selectable, so we use text
  const input = useHTMLInput(type === "password" ? "password" : "text");

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

  // free up wasd on unmount
  useEffect(() => {
    return () => {
      if (!isTyping()) controls.unlock();
    };
  }, [controls]);

  // set up event listeners
  useEffect(() => {
    const formatNumber = (s: string) => {
      const re = /[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/;
      const res = s.match(re);
      if (!res) return "";
      if (res.input !== res[0]) return value;
      else return res[0];
    };

    const onDocClick = () => {
      const focused = input === document.activeElement;
      if (!protectClick.current && focused) input.blur();
      else if (protectClick.current && !focused) input.focus();
      protectClick.current = false;
    };

    const onInput = () => {
      if (input !== document.activeElement) return;
      if (type === "number") input.value = formatNumber(input.value);
      onChange(input.value);
    };

    const onSelectionChange = () => {
      if (input !== document.activeElement) return;
      rerender();
    };

    document.addEventListener("click", onDocClick);
    input.addEventListener("input", onInput);
    document.addEventListener("selectionchange", onSelectionChange);

    return () => {
      document.removeEventListener("click", onDocClick);
      input.removeEventListener("input", onInput);
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, [input, onChange, rerender, type, value]);

  // keep the input's value in sync with the passed state value
  useEffect(() => {
    if (input.value !== value) {
      input.value = value;
      rerender();
    }
  }, [input, value]);

  // call to focus input and protect the click from blurring the input
  const focusInput = () => {
    protectClick.current = true;
    input.focus();
  };

  return { input, focused, focusInput };
};
