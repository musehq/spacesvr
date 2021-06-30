import { RoundedBox, Text } from "@react-three/drei";
import { GroupProps, useThree } from "@react-three/fiber";
import { Ref, useEffect, useMemo, useRef, useState } from "react";
import { animated, useSpring } from "react-spring/three";
import { Interactable } from "../modifiers";
import { useEnvironment, usePlayer } from "../core/contexts";
import { BufferGeometry, Group, Material, Mesh, Vector3 } from "three";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer";
import { useEditor } from "./EditMode";

type FileProps = {
  enabled?: boolean;
  open: boolean;
} & GroupProps;

const FONT_FILE =
  "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

export function FileInput(props: FileProps) {
  const { enabled = true, open, ...rest } = props;

  const { paused, device } = useEnvironment();
  const { controls, velocity } = usePlayer();
  const inputRef = useRef<HTMLInputElement>();
  const rBox = useRef<
    Mesh<BufferGeometry, Material | Material[]> | undefined
  >();
  const [focused, setFocused] = useState(false);
  const { editObject } = useEditor();
  const [idea, setIdea] = useState<string | null>(
    editObject ? editObject.name : null
  );
  const [cursorPos, setCursorPos] = useState<number | null>(null);
  const protectClick = useRef(false); // used to click off of the input to blur
  const textRef = useRef<any>();
  const selectedFile = useMemo(() => {
    if (inputRef.current && inputRef.current?.files?.length !== 0) {
      // @ts-ignore
      return inputRef.current.files[0].name;
    }
  }, [inputRef.current, inputRef?.current?.files]);

  const { color } = useSpring({ color: focused ? "#000" : "#828282" });

  useEffect(() => {
    if (!inputRef.current && enabled) {
      inputRef.current = document.createElement("input");
      inputRef.current.setAttribute("type", "file");
      inputRef.current.setAttribute(
        "accept",
        "image/png, image/jpeg, image/jpg"
      );
      inputRef.current.style.zIndex = "-99";
      inputRef.current.style.opacity = "0";
      inputRef.current.style.fontSize = "16px"; // this disables zoom on mobile
      inputRef.current.style.position = "absolute";
      inputRef.current.style.left = "50%";
      inputRef.current.style.top = "0";
      inputRef.current.style.transform = "translate(-50%, 0%)";

      inputRef.current.addEventListener("focus", () => setFocused(true));
      inputRef.current.addEventListener("blur", () => setFocused(false));

      setCursorPos(inputRef.current.selectionStart);

      document.body.appendChild(inputRef.current);

      return () => {
        if (inputRef.current) {
          document.body.removeChild(inputRef.current);
          inputRef.current = undefined;
          setFocused(false);
        }
      };
    }
  }, [enabled, editObject]);

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
          inputRef.current.click();
        }
        protectClick.current = false;
      };

      const onSelectionChange = () =>
        setCursorPos(inputRef?.current?.selectionStart || null);

      document.addEventListener("click", onDocClick);
      document.addEventListener("selectionchange", onSelectionChange);

      return () => {
        document.removeEventListener("click", onDocClick);
        document.removeEventListener("selectionchange", onSelectionChange);
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

  const percWidth =
    textRef.current?._textRenderInfo?.blockBounds[2] / INNER_WIDTH;
  const percCursor = cursorPos || 0;
  const offsetX = Math.max(percCursor * percWidth - 1 + 0.1, 0) * OUTER_WIDTH;
  const offset = selectedFile ? textRef.current.geometry.x : 0;

  useEffect(() => {
    if (textRef.current && inputRef.current) {
      // @ts-ignore
      if (selectedFile && textRef.current.color === "black") {
        textRef.current.color = "green";
      } else {
        textRef.current.color = "black";
      }
    }
  }, [textRef.current, inputRef.current, inputRef?.current?.files]);

  useEffect(() => {
    // @ts-ignore
    if (editObject && idea !== editObject.name) {
      // @ts-ignore
      inputRef.current.value = null;
      setIdea(editObject.name);
    }
  }, [editObject]);

  return (
    <group name="input" {...rest}>
      <Text
        ref={textRef}
        {...textStyles}
        position-z={0.051}
        position-x={-INNER_WIDTH / 2 + 0.175}
        clipRect={[-PADDING_X + offsetX, -Infinity, 0.275, Infinity]}
      >
        {selectedFile && open ? selectedFile : "Upload Image"}
      </Text>
      <Interactable onClick={() => focusInput()}>
        <RoundedBox args={[0.35, 0.1, 0.1]} radius={0.025} smoothness={4}>
          <meshStandardMaterial color="white" />
        </RoundedBox>
      </Interactable>
      <RoundedBox
        args={[0.35 + BORDER, 0.1 + BORDER, 0.1]}
        radius={0.025}
        smoothness={4}
        position-z={-0.001}
      >
        <animated.meshStandardMaterial color={color} />
      </RoundedBox>
    </group>
  );
}
