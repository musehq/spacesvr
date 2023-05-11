import { useCallback, useEffect, useRef } from "react";
import { useToolbelt } from "../logic/toolbelt";
import { useThree } from "@react-three/fiber";
import { useDrag } from "../../../logic/drag";
import { Html } from "@react-three/drei";
import { createPortal } from "react-dom";
import { useEnvironment } from "../../Environment";
import styled from "@emotion/styled";
import { Idea, isTyping } from "../../../logic";
import { useDelayedToggle } from "../../../logic/toggle";

const OUTER_PADDING = 40;
const INNER_PADDING = 10;
const FIXED_PADDING = OUTER_PADDING - INNER_PADDING;
const OUTER_BORDER_RADIUS = 25;

const Container = styled.div<{ open: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  padding: ${FIXED_PADDING}px ${FIXED_PADDING}px 0 ${FIXED_PADDING}px;
  border-radius: ${OUTER_BORDER_RADIUS}px;
  pointer-events: ${(props) => (props.open ? "all" : "none")};

  display: flex;
  max-width: calc(100% - 80px);
  flex-basis: calc(100% - 80px);
  flex-wrap: wrap;
  box-sizing: border-box;
  justify-content: center;
  width: max-content;
  max-height: 100%;
  overflow-y: auto;

  opacity: ${(props) => (props.open ? 1 : 0)};
  ${(props) =>
    props.open
      ? "transition: opacity 0.075s ease-in-out;"
      : "transition: opacity 0.4s ease-in-out;"};

  @media screen and (max-width: 600px) {
    padding: ${FIXED_PADDING}px 10px ${FIXED_PADDING}px 10px;
  }

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: hsl(0deg 0% 90% / 50%);
    border-radius: ${OUTER_BORDER_RADIUS}px;
    backdrop-filter: blur(15px);
    z-index: -1;
  }
`;

const ToolItem = styled.div<{ title: string; active: boolean }>`
  position: relative;
  width: 125px;
  height: 125px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  margin: 10px 10px ${OUTER_PADDING}px 10px;
  
  @media screen and (max-width: 600px) {
    width: 90px;
    height: 90px;
  }
  
  &:before {
    ${(props) => !props.active && "display: none;"}
    content: "";
    position: absolute;
    box-sizing: content-box;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    padding: ${INNER_PADDING}px;
    background: hsl(0deg 0% 50% / 50%);
    border-radius: 10px;
    z-index: -2;
  }
  
  // place text directly below the main box
  &:after {
    ${(props) => !props.active && "display: none;"}
    content: "${(props) => props.title}";
    position: absolute;
    bottom: -${OUTER_PADDING}px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.1rem;
    font-family: sans-serif;
    padding: 4px 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    text-align: center;
    color: #222;
    

    @media screen and (max-width: 600px) {
      font-size: 0.9rem;
    }
  }
`;

const LetterContent = styled.div<{ perc: number }>`
  width: 100%;
  height: 100%;
  background: oklch(75% 0.132 ${(props) => props.perc * 360});
  font-size: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: sans-serif;
  border-radius: 10px;
  color: #444;

  @media screen and (max-width: 600px) {
    font-size: 3rem;
  }
`;

const ImageContent = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const NoneItem = styled.div`
  display: inline-block;
  position: relative;
  border: 6px solid #444;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  box-sizing: content-box;

  &::after {
    content: "";
    width: 84px;
    height: 6px;
    position: absolute;
    left: 50%;
    top: 50%;
    background-color: #444;
    transform: translate(-50%, -50%) rotate(45deg);
  }
`;

export default function ToolSwitcher() {
  const { paused, containerRef } = useEnvironment();
  const {
    next,
    prev,
    activeIndex,
    setActiveIndex,
    tools,
    setDirection,
  } = useToolbelt();
  const { size, gl } = useThree();

  const { active: showing, setActive: setShowing } = useDelayedToggle(850);
  const registered = useRef(false);

  const DETECT_RANGE_X = screen.width * 0.05;
  const DRAG_RANGE_X = screen.width * 0.08;
  const DETECT_RANGE_Y = screen.height * 0.5;

  const valid = useRef(false);
  useDrag(
    {
      onStart: ({ e, touch }) => {
        valid.current = false;

        const inSideEdge =
          Math.min(touch.clientX, size.width - touch.clientX) < DETECT_RANGE_X;
        const inTopThird = touch.clientY < DETECT_RANGE_Y;

        // ignore if not in top third or side edge
        if (!inSideEdge || !inTopThird) return;

        valid.current = true;
        registered.current = false;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      },
      onMove: ({ delta }) => {
        if (!valid.current || registered.current) return;

        if (Math.abs(delta.x) > DRAG_RANGE_X) {
          registered.current = true;
          if (delta.x > 0) {
            setShowing();
            next();
          } else {
            setShowing();
            prev();
          }
        }
      },
    },
    gl.domElement,
    [screen.width, screen.height, next, prev]
  );

  useEffect(() => {
    const handleKeypress = (e: KeyboardEvent) => {
      if (isTyping() || e.metaKey || e.ctrlKey || paused) return;
      if (e.key == "Tab") {
        if (e.shiftKey) {
          setDirection("left");
          setShowing();
          if (activeIndex === undefined) setActiveIndex(tools.length - 1);
          else if (activeIndex === 0) setActiveIndex(undefined);
          else setActiveIndex((activeIndex - 1 + tools.length) % tools.length);
        } else {
          setDirection("right");
          setShowing();
          if (activeIndex === undefined) setActiveIndex(0);
          else if (activeIndex === tools.length - 1) setActiveIndex(undefined);
          else setActiveIndex((activeIndex + 1) % tools.length);
        }

        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeypress);
    return () => document.removeEventListener("keydown", handleKeypress);
  }, [activeIndex, paused, setActiveIndex, setDirection, setShowing, tools]);

  const clickItem = useCallback(
    (index: number | undefined) => {
      setShowing();
      setActiveIndex(index);
    },
    [setActiveIndex, setShowing]
  );

  return (
    <Html>
      {createPortal(
        <Container open={showing}>
          <ToolItem
            title="None"
            active={activeIndex === undefined}
            onClick={() => clickItem(undefined)}
          >
            <NoneItem />
          </ToolItem>
          {tools.map((tool, i) => (
            <ToolItem
              key={`${tool.name}-${i}`}
              title={tool.name}
              active={activeIndex === i}
              onClick={() => clickItem(i)}
            >
              {tool.icon ? (
                <ImageContent src={tool.icon} />
              ) : (
                <LetterContent
                  perc={new Idea().updateFromText(tool.name).mediation}
                >
                  {tool.name.substring(0, 1)}
                </LetterContent>
              )}
            </ToolItem>
          ))}
        </Container>,
        containerRef.current!
      )}
    </Html>
  );
}
