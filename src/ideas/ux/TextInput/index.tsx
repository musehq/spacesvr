import { useMemo, useRef } from "react";
import { RoundedBox, Text } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { useTextInput } from "../../../logic/input";
import { Interactable } from "../../modifiers/Interactable";
import { useKeypress } from "../../../logic/keys";
import { usePlayer } from "../../../layers/Player";
import { Mesh, Vector2 } from "three";
// @ts-ignore
import { getCaretAtPoint } from "troika-three-text";

type TextProps = {
  value: string;
  setValue: (s: string) => void;
  fontSize?: number;
  onSubmit?: () => void;
  onChange?: (s: string) => string;
  width?: number;
} & GroupProps;

export function TextInput(props: TextProps) {
  const {
    fontSize = 0.1,
    value,
    setValue,
    onChange,
    onSubmit,
    width = 1,
    ...rest
  } = props;

  const { raycaster } = usePlayer();

  const textRef = useRef<any>();
  const caret = useRef<Mesh>(null);
  const highlight = useRef<Mesh>(null);

  const { input, focused, selection, focusInput } = useTextInput(
    value,
    setValue,
    onChange
  );

  const { color } = useSpring({ color: focused ? "#000" : "#828282" });
  const dummy = useMemo(() => new Vector2(), []);
  const lastSelection = useRef<[number | null, number | null]>([null, null]);
  const lastFocused = useRef<boolean>(false);
  const scrollLeft = useRef(0);

  const BORDER = 0.01;
  const OUTER_WIDTH = width;
  const PADDING_X = 0;
  const INNER_WIDTH = OUTER_WIDTH - PADDING_X * 2;
  const FONT_SIZE = fontSize;

  const registerClick = () => {
    focusInput();
    const _text = textRef.current;
    if (!_text || !_text.textRenderInfo || !input || !focused) return;
    const intersections = raycaster.intersectObject(_text, true);
    if (intersections.length > 0) {
      const inter = intersections[0];
      const textPos = _text.worldPositionToTextCoords(inter.point, dummy);
      const car = getCaretAtPoint(_text.textRenderInfo, textPos.x, textPos.y);
      input.setSelectionRange(car.charIndex, car.charIndex);
    }
  };

  const textStyles: Partial<typeof Text.defaultProps> = {
    anchorX: "left",
    maxWidth: INNER_WIDTH,
    textAlign: "left",
    fontSize: FONT_SIZE,
    color: "black",
    // @ts-ignore
    whiteSpace: "nowrap",
  };

  useKeypress(
    "Enter",
    () => {
      if (!focused || !onSubmit) return;
      onSubmit();
    },
    [focused, onSubmit]
  );

  if (textRef.current && input && caret.current && highlight.current) {
    const _text = textRef.current;
    const _caret = caret.current;
    const _highlight = highlight.current;

    if (
      selection[0] !== lastSelection.current[0] ||
      selection[1] !== lastSelection.current[1]
    ) {
      lastSelection.current = selection;
      _text._needsSync = true;
    }

    if (focused !== lastFocused.current) {
      lastFocused.current = focused;
      _text._needsSync = true;
    }

    _text.text = value;

    _text.sync(() => {
      const caretPositions = _text.textRenderInfo.caretPositions;
      let offsetX;
      const TEXT_SELECTED = selection[0] !== selection[1] && focused;

      if (!focused) {
        offsetX = 0;
        _caret.visible = false;
      } else {
        const activeSelection =
          TEXT_SELECTED && input.selectionDirection === "forward"
            ? selection[1]
            : selection[0];

        offsetX = scrollLeft.current / INNER_WIDTH;
        _caret.visible = true;

        // position caret based on cursor position
        _caret.position.x = -INNER_WIDTH / 2 - offsetX; // get it all the way to the left

        const index = Math.min(
          (activeSelection || 0) * 3,
          value.length * 3 - 2
        );
        const caretX = caretPositions[index];
        if (caretX !== undefined) {
          _caret.position.x += caretX;
        }

        // scroll to keep caret in view if it goes too far right
        if (_caret.position.x > INNER_WIDTH / 2) {
          if (activeSelection === value.length) {
            // scroll one char right
            scrollLeft.current += _caret.position.x - INNER_WIDTH / 2;
            _caret.position.x = INNER_WIDTH / 2;
          } else {
            // scroll halfway
            const diff = Math.min(INNER_WIDTH / 2, _caret.position.x);
            scrollLeft.current += diff;
            _caret.position.x -= diff;
          }
        }

        // scroll to keep caret in view if it goes too far left
        if (_caret.position.x < -INNER_WIDTH / 2) {
          if (selection[0] === 0 || selection[0] === null) {
            // scroll one char left
            scrollLeft.current += _caret.position.x + INNER_WIDTH / 2;
            _caret.position.x = -INNER_WIDTH / 2;
          } else {
            // scroll halfway
            const diff = Math.max(-INNER_WIDTH / 2, _caret.position.x);
            scrollLeft.current += diff;
            _caret.position.x -= diff;
          }
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
          _caret.position.x -= scrollLeft.current;
          scrollLeft.current = 0;
        }

        // update the offset
        offsetX = scrollLeft.current / INNER_WIDTH;
      }

      if (!TEXT_SELECTED) {
        _highlight.visible = false;
      } else {
        _highlight.visible = true;
        _caret.visible = false;

        const startIndex = Math.min(
          (selection[0] || 0) * 3,
          value.length * 3 - 2
        );
        const startX = caretPositions[startIndex];
        const endIndex = Math.min(
          (selection[1] || 0) * 3,
          value.length * 3 - 2
        );
        const endX = caretPositions[endIndex];
        if (startX !== undefined && endX !== undefined) {
          const width = endX - startX;
          _highlight.position.x =
            -INNER_WIDTH / 2 + startX - offsetX + width / 2;
          _highlight.scale.x = width;

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

      // update the text offset
      if (!_text.clipRect) _text.clipRect = [0, 0, 0, 0];
      _text.clipRect[0] = -PADDING_X + offsetX;
      _text.clipRect[1] = -Infinity;
      _text.clipRect[2] = INNER_WIDTH + PADDING_X + offsetX;
      _text.clipRect[3] = Infinity;
      _text.minWidth = INNER_WIDTH;
      _text.position.x = -INNER_WIDTH / 2 - offsetX;

      _text.sync();
    });
  }

  const TEXT_WIDTH = OUTER_WIDTH + 0.1;
  const TEXT_HEIGHT = FONT_SIZE * 1.75;
  const TEXT_DEPTH = 0.1;

  return (
    <group name="spacesvr-text-input" {...rest}>
      <Text name="displayText" ref={textRef} {...textStyles} position-z={0.051}>
        {""}
      </Text>
      <mesh name="caret" ref={caret} position-z={0.051}>
        <planeBufferGeometry args={[0.075 * FONT_SIZE, FONT_SIZE]} />
        <meshBasicMaterial color="black" />
      </mesh>
      <mesh name="highlight" ref={highlight} position-z={0.051}>
        <boxBufferGeometry args={[1, FONT_SIZE, TEXT_DEPTH * 0.25]} />
        <meshStandardMaterial color="blue" transparent opacity={0.3} />
      </mesh>
      <Interactable
        key={`${focused}-${selection[0]}-${selection[1]}`}
        onClick={() => registerClick()}
      >
        <RoundedBox
          args={[TEXT_WIDTH, TEXT_HEIGHT, TEXT_DEPTH]}
          radius={0.025}
          smoothness={4}
        >
          <meshStandardMaterial color="white" />
        </RoundedBox>
      </Interactable>
      <RoundedBox
        args={[TEXT_WIDTH + BORDER, TEXT_HEIGHT + BORDER, TEXT_DEPTH]}
        radius={0.025}
        smoothness={4}
        position-z={-0.001}
      >
        {/* @ts-ignore */}
        <animated.meshStandardMaterial color={color} />
      </RoundedBox>
    </group>
  );
}
