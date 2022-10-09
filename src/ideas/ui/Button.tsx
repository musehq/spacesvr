import { RoundedBox, Text } from "@react-three/drei";
import { animated, config, useSpring } from "@react-spring/three";
import { GroupProps } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Interactable } from "../modifiers/Interactable";
import { Idea } from "../../logic/basis/idea";
import { Raycaster } from "three";

type ButtonProps = {
  children?: string;
  onClick?: () => void;
  font?: string;
  fontSize?: number;
  maxWidth?: number;
  textColor?: string;
  color?: string;
  outline?: boolean;
  outlineColor?: string;
  idea?: Idea;
  raycaster?: Raycaster;
} & GroupProps;

export function Button(props: ButtonProps) {
  const {
    children,
    onClick,
    font = "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf",
    fontSize = 0.05,
    maxWidth = 0.25,
    textColor = "black",
    color = "#aaa",
    outline = true,
    outlineColor = "white",
    idea,
    raycaster,
    ...rest
  } = props;

  const textRef = useRef<any>();

  const [dims, setDims] = useState([0, 0]);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const REST_COLOR = idea ? idea.getHex() : color;
  const HOVER_COLOR = idea ? idea.getHex() : "#fff";

  const { animColor, scale } = useSpring({
    animColor: hovered ? HOVER_COLOR : REST_COLOR,
    scale: clicked ? 0.75 : 1,
    ...config.stiff,
  });

  // spring animation on click
  useEffect(() => {
    if (clicked) setTimeout(() => setClicked(false), 150);
  }, [clicked]);

  const onButtonClick = () => {
    if (onClick) onClick();
    setClicked(true);
  };

  // keep dimensions up to date
  useEffect(() => {
    textRef.current.addEventListener("synccomplete", () => {
      const info = textRef.current.textRenderInfo;
      const w = info.blockBounds[2] - info.blockBounds[0];
      const h = info.blockBounds[3] - info.blockBounds[1];
      setDims([w, h]);
    });
    textRef.current.sync();
  }, []);

  const PADDING = fontSize * 0.9;
  const WIDTH = dims[0] + PADDING * 2;
  const HEIGHT = dims[1] + PADDING;
  const DEPTH = fontSize * 1.1;
  const OUTLINE_WIDTH = outline ? fontSize * 0.075 : 0;
  const RADIUS = Math.min(WIDTH, HEIGHT, DEPTH) * 0.5;

  return (
    <group name={`button-${children}`} {...rest}>
      <animated.group scale={scale}>
        <Text
          ref={textRef}
          color={textColor}
          font={font}
          fontSize={fontSize}
          maxWidth={maxWidth}
          outlineWidth={OUTLINE_WIDTH}
          outlineColor={outlineColor}
          anchorY="middle"
          textAlign="center"
          position-z={DEPTH / 2 + 0.0025}
        >
          {children}
        </Text>
        <Interactable
          onClick={onButtonClick}
          onHover={() => setHovered(true)}
          onUnHover={() => setHovered(false)}
          raycaster={raycaster}
        >
          <RoundedBox
            args={[WIDTH, HEIGHT, DEPTH]}
            radius={RADIUS}
            smoothness={10}
          >
            {/* @ts-ignore */}
            <animated.meshStandardMaterial color={animColor} />
          </RoundedBox>
        </Interactable>
      </animated.group>
    </group>
  );
}
