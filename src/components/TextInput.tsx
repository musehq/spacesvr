import { RoundedBox, Text } from "@react-three/drei";
import { GroupProps, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { animated, useSpring } from "react-spring/three";
import { useEnvironment, usePlayer } from "../core/contexts";
import { Interactable } from "../modifiers";
import { Vector3 } from "three";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer";

type TextProps = {
  value: string;
  setValue: (s: string) => void;
  enabled?: boolean;
  inputType?: "text" | "password" | "email";
} & GroupProps;

const FONT_FILE =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

export function TextInput(props: TextProps) {
  const {
    value,
    setValue,
    enabled = true,
    inputType = "text",
    ...rest
  } = props;

  const { paused, device } = useEnvironment();
  const { controls, velocity } = usePlayer();
  const inputRef = useRef<HTMLInputElement>();
  const [focused, setFocused] = useState(false);
  const [cursorPos, setCursorPos] = useState<number | null>(null);
  const protectClick = useRef(false); // used to click off of the input to blur
  const textRef = useRef<any>();

  const { color } = useSpring({ color: focused ? "#000" : "#828282" });

  useEffect(() => {
    if (!inputRef.current && enabled) {
      inputRef.current = document.createElement("input");
      inputRef.current.setAttribute("type", "text");
      inputRef.current.style.zIndex = "99";
      inputRef.current.style.opacity = "1";
      inputRef.current.style.fontSize = "16px"; // this disables zoom on mobile
      inputRef.current.style.position = "absolute";
      inputRef.current.style.left = "50%";
      inputRef.current.style.top = "0";
      inputRef.current.style.transform = "translate(-50%, 0%)";

      inputRef.current.addEventListener("focus", () => setFocused(true));
      inputRef.current.addEventListener("blur", () => setFocused(false));
      console.log(inputRef.current);

      setCursorPos(inputRef.current.selectionStart);
      setValue(inputRef.current.value);

      document.body.appendChild(inputRef.current);

      return () => {
        if (inputRef.current) {
          document.body.removeChild(inputRef.current);
          inputRef.current = undefined;
          setFocused(false);
        }
      };
    }
  }, [enabled]);

  useEffect(() => {
    if (focused) {
      velocity.set(new Vector3(0, 0, 0));
      controls.lock();
    }

    if (!focused) {
      velocity.set(new Vector3(0, 0, 0));
      controls.unlock();
    }

    if (inputRef.current && focused) {
      if (!enabled || (paused && device.desktop)) {
        inputRef.current.blur();
      }
    }

    if (enabled) {
      const onDocClick = () => {
        if (!protectClick.current && inputRef.current) {
          inputRef.current.blur();
        } else if (inputRef.current) {
          inputRef.current.focus();
        }
        protectClick.current = false;
      };

      const onKeyup = (e: KeyboardEvent) => {
        if (!focused || !inputRef.current) return;
        // inputRef.current.value = inputRef.current.value + e.key;
        console.log(e);
        // console.log(inputRef.current.value)
        setCursorPos(inputRef.current.selectionStart);
        // setCursorPos(inputRef.current.selectionStart);
        setValue(inputRef.current.value);
      };

      const onSelectionChange = () =>
        setCursorPos(inputRef?.current?.selectionStart || null);

      inputRef?.current?.addEventListener("change", () => {
        console.log("change");
      });
      document.addEventListener("click", onDocClick);
      document.addEventListener("keyup", onKeyup);
      document.addEventListener("selectionchange", onSelectionChange);

      // document.addEventListener("change", onKeyup);

      return () => {
        document.removeEventListener("click", onDocClick);
        document.removeEventListener("keyup", onKeyup);
        document.removeEventListener("selectionchange", onSelectionChange);

        // document.removeEventListener("change", onKeyup);
      };
    }
  }, [enabled, focused, paused]);

  const focusInput = () => {
    if (!inputRef.current) return;
    protectClick.current = true;
    inputRef.current.focus();
  };

  const BORDER = 0.005;
  const OUTER_WIDTH = 0.65;
  const PADDING_X = 0.01;
  const INNER_WIDTH = OUTER_WIDTH - PADDING_X * 2;

  const textStyles: Partial<typeof Text.defaultProps> = {
    font: FONT_FILE,
    anchorX: "left",
    maxWidth: INNER_WIDTH,
    textAlign: "left",
    fontSize: 0.0385,
    color: "black",
    // outlineWidth: 0.00275,
    // @ts-ignore
    whiteSpace: "nowrap",
    sdfGlyphSize: 16,
  };

  const stringValue =
    inputType === "password" ? value.replace(/./g, "•") : value;

  const displayValue =
    cursorPos !== null && focused
      ? stringValue.substring(0, cursorPos) +
        "|" +
        stringValue.substring(cursorPos)
      : stringValue;

  const percWidth =
    textRef.current?._textRenderInfo?.blockBounds[2] / INNER_WIDTH;
  const percCursor = (cursorPos || 0) / displayValue.length;
  const offsetX = Math.max(percCursor * percWidth - 1 + 0.1, 0) * OUTER_WIDTH;

  return (
    <group name="input" {...rest}>
      <Text
        ref={textRef}
        {...textStyles}
        position-z={0.051}
        position-x={-INNER_WIDTH / 2 - offsetX}
        clipRect={[
          -PADDING_X + offsetX,
          -Infinity,
          INNER_WIDTH + PADDING_X + offsetX,
          Infinity,
        ]}
      >
        {displayValue}
      </Text>
      <Interactable onClick={() => focusInput()}>
        <RoundedBox args={[0.7, 0.1, 0.1]} radius={0.025} smoothness={4}>
          <meshStandardMaterial color="white" />
        </RoundedBox>
      </Interactable>
      <RoundedBox
        args={[0.7 + BORDER, 0.1 + BORDER, 0.1]}
        radius={0.025}
        smoothness={4}
        position-z={-0.001}
      >
        <animated.meshStandardMaterial color={color} />
      </RoundedBox>
    </group>
  );
}
