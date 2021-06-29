import { Text, useGLTF } from "@react-three/drei";
import { MeshBasicMaterial } from "three";
import { COLORS, FILE_URL, HOTBAR_SCALE } from "../constants/constants";
import { GLTFResult } from "../types/types";
import React, { useState } from "react";
import { animated, useSpring } from "react-spring/three";
import { Interactable } from "../../../modifiers";

function Deploy() {
  console.log("PUBLISH");
}

export function Publish() {
  const [hover, setHover] = useState<boolean>(false);
  const { nodes, materials } = useGLTF(FILE_URL) as GLTFResult;
  const publishMat = new MeshBasicMaterial({ color: COLORS.btnPrimary });
  const { color, posZ } = useSpring({
    color: hover ? COLORS.btnHovered : COLORS.btnSecondary,
    posZ: hover ? 0.15 : 0,
    config: {
      mass: 1,
    },
  });

  return (
    <Interactable
      onHover={() => {
        setHover(true);
      }}
      onUnHover={() => {
        setHover(false);
      }}
      onClick={Deploy}
    >
      <group scale={HOTBAR_SCALE} dispose={null} name="publish">
        <animated.group position-z={posZ}>
          <mesh name="publish" geometry={nodes.publish.geometry}>
            <meshBasicMaterial color="#417E25" />
          </mesh>
        </animated.group>
        <mesh name="publish-click" geometry={nodes["publish-click"].geometry}>
          <animated.meshBasicMaterial color={color} />
        </mesh>
        <Text
          position={[2.3, -0.33, 0.075]}
          fontSize={0.2}
          color={COLORS.textPrimary}
          textAlign="center"
          name="publish-btn-label"
        >
          Publish
        </Text>
      </group>
    </Interactable>
  );
}
