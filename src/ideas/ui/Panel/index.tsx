import { animated, useSpring } from "@react-spring/three";
import { ReactNode } from "react";
import { RoundedBox } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { useVisible } from "logic/visible";
import { Interactable } from "../../modifiers/Interactable";
import { FacePlayer } from "../../modifiers/FacePlayer";
import { useHotbar } from "./logic/hotbar";

type PanelProps = {
  open: boolean;
  close?: () => void;
  closable?: boolean;
  width?: number;
  height?: number;
  depth?: number;
  zIndex?: number;
  face?: boolean;
  children?: ReactNode | ReactNode[];
} & GroupProps;

export default function Panel(props: PanelProps) {
  const {
    open,
    close,
    closable = true,
    width = 0.75,
    height = 0.25,
    depth = 0.05,
    zIndex = 0,
    face = false,
    children,
    ...rest
  } = props;

  const { nodes } = useHotbar();

  // overarching scale
  const { scale } = useSpring({ scale: open ? 1 : 0 });
  const visible = useVisible(scale);

  // minimize
  const { shrink, posY, posZ } = useSpring({
    shrink: 1 - Math.pow(zIndex, 0.5) * 0.5,
    posY: Math.pow(zIndex, 0.5) * height * 0.65,
    posZ: zIndex * depth * -0.9,
  });

  const RADIUS = Math.min(width, height, depth) * 0.5;
  const PADDING_X = 0.035;
  const PADDING_Y = (PADDING_X / width) * height * 2;

  // top left align close geometry
  const OFFSET_X = 0.015;
  const OFFSET_Y = -0.015;

  if (!visible) return null;

  return (
    <group name="spacesvr-panel" {...rest}>
      <animated.group name="scaled" scale={scale}>
        <FacePlayer enabled={face}>
          <animated.group
            name="minimization-from-z-index"
            scale={shrink}
            position-y={posY}
            position-z={posZ}
          >
            <RoundedBox
              args={[width, height, depth]}
              radius={RADIUS}
              smoothness={10}
            >
              <meshLambertMaterial color="white" />
            </RoundedBox>
            <group name="panel-content" position-z={0.03}>
              {closable && (
                <group
                  name="close"
                  scale={0.125}
                  position={[
                    -width / 2 + PADDING_X + OFFSET_X,
                    height / 2 - PADDING_Y + OFFSET_Y,
                    0,
                  ]}
                >
                  <Interactable onClick={close}>
                    <mesh name="hitbox" visible={false}>
                      <planeBufferGeometry args={[0.34, 0.34]} />
                    </mesh>
                  </Interactable>
                  <mesh geometry={nodes.close.geometry}>
                    <meshBasicMaterial color="black" />
                  </mesh>
                </group>
              )}
              {children}
            </group>
          </animated.group>
        </FacePlayer>
      </animated.group>
    </group>
  );
}
