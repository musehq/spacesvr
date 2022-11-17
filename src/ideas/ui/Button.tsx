import { RoundedBox, Text } from "@react-three/drei";
import { animated, config, useSpring } from "@react-spring/three";
import { GroupProps } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Interactable } from "../modifiers/Interactable";
import { Idea } from "../../logic/basis/idea";
import { Color, Raycaster } from "three";

type ButtonProps = {
  children?: string;
  onClick?: () => void;
  font?: string;
  fontSize?: number;
  maxWidth?: number;
  width?: number;
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
    width,
    maxWidth = 0.25,
    textColor = "black",
    color = "#fff",
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

  const REST_COLOR = useMemo(() => {
    return idea ? idea.getHex() : color;
  }, [color, idea]);

  const HOVER_COLOR = useMemo(() => {
    const hoverIdea = idea
      ? idea.clone()
      : new Idea().setFromHex("#" + new Color(REST_COLOR).getHexString());
    const offset = 0.175 * (hoverIdea.utility > 0.5 ? -1 : 1);
    hoverIdea.setUtility(hoverIdea.utility + offset);
    return hoverIdea.getHex();
  }, [REST_COLOR, idea]);

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
  useLayoutEffect(() => {
    textRef.current.addEventListener("synccomplete", () => {
      const info = textRef.current.textRenderInfo;
      const w = info.blockBounds[2] - info.blockBounds[0];
      const h = info.blockBounds[3] - info.blockBounds[1];
      setDims([w, h]);
    });
    textRef.current.sync();
  }, []);

  const PADDING = fontSize * 0.9;
  const MAX_WIDTH = width ? Math.min(width, maxWidth) : maxWidth;
  const WIDTH = (width || dims[0]) + PADDING * 2;
  const HEIGHT = dims[1] + PADDING;
  const DEPTH = fontSize * 1.1;
  const OUTLINE_WIDTH = outline ? fontSize * 0.075 : 0;
  const RADIUS = Math.min(WIDTH, HEIGHT, DEPTH) * 0.5;

  return (
    <group name={`spacesvr-button-${children}`} {...rest}>
      <animated.group scale={scale}>
        <Text
          ref={textRef}
          color={textColor}
          font={font}
          fontSize={fontSize}
          maxWidth={MAX_WIDTH}
          outlineWidth={OUTLINE_WIDTH}
          outlineColor={outlineColor}
          anchorY="middle"
          textAlign="center"
          position-z={DEPTH / 2 + 0.001}
        >
          {children}
        </Text>
        <Interactable
          onClick={onButtonClick}
          onHover={() => setHovered(true)}
          onUnHover={() => setHovered(false)}
          raycaster={raycaster}
        >
          <mesh visible={false} name="hitbox">
            <boxBufferGeometry args={[WIDTH, HEIGHT, DEPTH]} />
          </mesh>
        </Interactable>
        <RoundedBox
          args={[WIDTH, HEIGHT, DEPTH]}
          radius={RADIUS}
          smoothness={8}
        >
          {/* @ts-ignore */}
          <animated.meshStandardMaterial color={animColor} />
        </RoundedBox>
      </animated.group>
    </group>
  );
}
