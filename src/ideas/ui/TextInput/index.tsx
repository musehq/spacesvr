import { useRef, Suspense, useState, useCallback } from "react";
import { RoundedBox, Text } from "@react-three/drei";
import { GroupProps, useThree } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { useTextInput } from "../../../logic/input";
import { Interactable } from "../../modifiers/Interactable";
import { useKeypress, useShiftHold } from "../../../logic/keys";
import { usePlayer } from "../../../layers/Player";
import { Mesh, Raycaster } from "three";
import { syncOnChange } from "./logic/sync";
import {
  getClickedCaret,
  getClickType,
  getWordBoundsAtCaret,
  handleShiftSelect,
} from "./logic/select";
import { useCaretBlink } from "./logic/blink";
import { useDragSelect } from "./logic/drag";
import { useLimitedFrame } from "../../../logic/limiter";

type TextProps = {
  value?: string;
  setValue?: (s: string) => void;
  onChange?: (s: string) => string;
  onSubmit?: (s: string) => void;
  font?: string;
  fontSize?: number;
  width?: number;
  placeholder?: string;
  raycaster?: Raycaster;
} & GroupProps;

export function TextInput(props: TextProps) {
  const {
    value,
    setValue,
    onChange,
    onSubmit,
    font,
    fontSize = 0.1,
    width = 1,
    placeholder,
    raycaster: passedRaycaster,
    ...rest
  } = props;

  const clock = useThree((st) => st.clock);
  const player = usePlayer();
  const RAYCASTER = passedRaycaster || player.raycaster;

  const textRef = useRef<any>();
  const caret = useRef<Mesh>(null);
  const highlight = useRef<Mesh>(null);
  const [localValue, setLocalValue] = useState("");

  const { input, focused, focusInput } = useTextInput(
    value || localValue,
    setValue || setLocalValue,
    onChange
  );

  const { color } = useSpring({ color: focused ? "#000" : "#828282" });

  const BORDER = fontSize * 0.1;
  const PADDING_X = fontSize * 0.5;
  const INNER_WIDTH = width - PADDING_X * 2;

  const INPUT_HEIGHT = fontSize * 1.75;
  const INPUT_WIDTH = width;

  const OUTER_HEIGHT = INPUT_HEIGHT + BORDER;
  const OUTER_WIDTH = width + BORDER * 2;

  const DEPTH = fontSize * 0.5;
  const RADIUS = Math.min(INPUT_WIDTH, INPUT_HEIGHT, DEPTH) * 0.5;

  const shift = useShiftHold();
  const lastClickTime = useRef(0);
  const lastDoubleClickTime = useRef(0);
  const registerClick = () => {
    focusInput();
    const _text = textRef.current;
    if (!_text || !_text.textRenderInfo || !input || !focused) return;
    const car = getClickedCaret(_text, RAYCASTER);
    if (car === null) {
      // clicked in empty space in the text box
      input.setSelectionRange(input.value.length, input.value.length);
    } else if (!shift.current) {
      const clickType = getClickType(clock, lastClickTime, lastDoubleClickTime);
      if (clickType === 1) {
        input.setSelectionRange(car.charIndex, car.charIndex);
      } else if (clickType === 2) {
        const wordBounds = getWordBoundsAtCaret(input.value, car.charIndex);
        input.setSelectionRange(wordBounds[0], wordBounds[1]);
      } else {
        input.setSelectionRange(0, input.value.length);
      }
    } else {
      lastClickTime.current = 0;
      lastDoubleClickTime.current = 0;
      handleShiftSelect(input, car.charIndex);
    }
  };

  useDragSelect(input, textRef, RAYCASTER, focusInput);

  useKeypress(
    "Enter",
    () => {
      if (!focused || !onSubmit) return;
      onSubmit(input.value);
    },
    [input, focused, onSubmit]
  );

  const updateText = useCallback((leftOffset: number, width: number) => {
    const _text = textRef.current;
    if (!_text) return;
    if (!_text.clipRect) _text.clipRect = [0, 0, 0, 0];
    _text.clipRect[0] = leftOffset;
    _text.clipRect[1] = -Infinity;
    _text.clipRect[2] = width + leftOffset;
    _text.clipRect[3] = Infinity;
    _text.minWidth = width;
    _text.position.x = -width / 2 - leftOffset;
    _text.sync();
  }, []);

  const scrollLeft = useRef(0);
  const blink = useCaretBlink(0.65);
  if (textRef.current && input && caret.current && highlight.current) {
    const _text = textRef.current;
    const _caret = caret.current;
    const _highlight = highlight.current;

    if (!focused && placeholder && input.value === "") {
      _text.text = placeholder;
      _text.color = "#828282";
    } else {
      _text.text = input.value;
      _text.color = "black";
    }

    syncOnChange(_text, "focused", focused);
    syncOnChange(_text, "selectionStart", input.selectionStart);
    syncOnChange(_text, "selectionEnd", input.selectionEnd);
    syncOnChange(_text, "fontSize", fontSize);
    syncOnChange(_text, "scrollLeft", scrollLeft.current);

    _text.sync(() => {
      blink.reset();

      const caretPositions = _text.textRenderInfo.caretPositions;
      const TEXT_SELECTED =
        input.selectionStart !== input.selectionEnd && focused;

      _caret.visible = false;
      _highlight.visible = false;

      // CASE 1: not focused
      if (!focused) {
        updateText(0, INNER_WIDTH);
      }

      // CASE 2: focused, maybe selected, get caret in view
      if (focused) {
        _caret.visible = true;

        const activeSel =
          (TEXT_SELECTED && input.selectionDirection === "forward"
            ? input.selectionEnd
            : input.selectionStart) || 0;

        // get it all the way to the left
        _caret.position.x = -INNER_WIDTH / 2 - scrollLeft.current;

        // move it to the right character
        const index = Math.min(activeSel * 3, input.value.length * 3 - 2);
        const caretX = caretPositions[index];
        if (caretX !== undefined) {
          _caret.position.x += caretX;
        }

        // scroll to keep caret in view if it goes too far right
        if (_caret.position.x > INNER_WIDTH / 2) {
          if (activeSel === input.value.length) {
            // scroll one char right
            scrollLeft.current += _caret.position.x - INNER_WIDTH / 2;
            _caret.position.x = INNER_WIDTH / 2;
          } else {
            // center caret
            scrollLeft.current += _caret.position.x;
            _caret.position.x -= _caret.position.x;
          }
        }

        // scroll to keep caret in view if it goes too far left
        if (_caret.position.x < -INNER_WIDTH / 2) {
          scrollLeft.current += _caret.position.x;
          _caret.position.x = 0;
        }

        // right adjust
        const len = caretPositions.length;
        const lastCaretX = caretPositions[len - 2];
        const lastCharOffset = INNER_WIDTH - lastCaretX + scrollLeft.current;
        if (lastCharOffset > 0 && scrollLeft.current > 0) {
          _caret.position.x += lastCharOffset;
          scrollLeft.current -= lastCharOffset;
        }

        // left adjust
        if (scrollLeft.current < 0) {
          _caret.position.x += scrollLeft.current;
          scrollLeft.current = 0;
        }

        updateText(scrollLeft.current, INNER_WIDTH);
      }

      // CASE 3: focused and selected, show highlight
      if (TEXT_SELECTED) {
        _highlight.visible = true;
        _caret.visible = false;

        const finalCharIndex = input.value.length * 3 - 2;

        const startIndex = Math.min(
          (input.selectionStart || 0) * 3,
          finalCharIndex
        );
        const startX = caretPositions[startIndex];

        const endIndex = Math.min(
          (input.selectionEnd || 0) * 3,
          finalCharIndex
        );
        const endX = caretPositions[endIndex];

        if (startX !== undefined && endX !== undefined) {
          const highWidth = endX - startX;
          _highlight.position.x =
            -INNER_WIDTH / 2 + startX - scrollLeft.current + highWidth / 2;
          _highlight.scale.x = highWidth;

          const leftEdge = _highlight.position.x - _highlight.scale.x / 2;
          if (leftEdge < -INNER_WIDTH / 2) {
            const diff = -INNER_WIDTH / 2 - leftEdge;
            _highlight.position.x += diff / 2;
            _highlight.scale.x -= diff;
          }

          const rightEdge = _highlight.position.x + _highlight.scale.x / 2;
          if (rightEdge > INNER_WIDTH / 2) {
            const diff = rightEdge - INNER_WIDTH / 2;
            _highlight.position.x -= diff / 2;
            _highlight.scale.x -= diff;
          }
        }
      }
    });
  }

  // scroll the input if user is dragging a selection to the left or right
  const SCROLL_BUFFER = fontSize;
  const MOVE_SPEED = fontSize * 0.25;
  useLimitedFrame(1, () => {
    const _text = textRef.current;
    const _caret = caret.current;
    const TEXT_SELECTED =
      input.selectionStart !== input.selectionEnd && focused;
    if (!_text || !_caret || !TEXT_SELECTED) return;

    // scroll to the right
    if (_caret.position.x > INNER_WIDTH / 2 - SCROLL_BUFFER) {
      scrollLeft.current += MOVE_SPEED;
    }

    // scroll to the left
    if (_caret.position.x < -INNER_WIDTH / 2 + SCROLL_BUFFER) {
      scrollLeft.current -= MOVE_SPEED;
    }
  });

  return (
    <group name="spacesvr-text-input" {...rest}>
      <group name="content" position-z={DEPTH / 2 + 0.001}>
        <Suspense fallback={null}>
          <Text
            name="text"
            ref={textRef}
            color="black"
            anchorX="left"
            fontSize={fontSize}
            font={font}
            maxWidth={INNER_WIDTH}
            // @ts-ignore
            whiteSpace="nowrap"
          >
            {""}
          </Text>
        </Suspense>
        <group name="blink" ref={blink.blinkRef}>
          <mesh name="caret" ref={caret} visible={false}>
            <planeBufferGeometry args={[0.075 * fontSize, fontSize]} />
            <meshBasicMaterial color="black" />
          </mesh>
        </group>
        <mesh name="highlight" ref={highlight} visible={false}>
          <boxBufferGeometry args={[1, fontSize, DEPTH * 0.45]} />
          <meshStandardMaterial
            color="blue"
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </mesh>
      </group>
      <Interactable onClick={registerClick} raycaster={RAYCASTER}>
        <RoundedBox
          args={[INPUT_WIDTH, INPUT_HEIGHT, DEPTH]}
          radius={RADIUS}
          smoothness={8}
        >
          <meshStandardMaterial color="white" />
        </RoundedBox>
      </Interactable>
      <RoundedBox
        args={[OUTER_WIDTH, OUTER_HEIGHT, DEPTH]}
        radius={RADIUS}
        smoothness={8}
        position-z={-0.001}
      >
        {/* @ts-ignore */}
        <animated.meshStandardMaterial color={color} />
      </RoundedBox>
    </group>
  );
}
