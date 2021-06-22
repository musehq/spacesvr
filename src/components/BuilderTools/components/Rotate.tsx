import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { GroupProps, useFrame, useThree } from "@react-three/fiber";
import { animated, useSpring } from "react-spring/three";
import { Interactable } from "../../../modifiers";
import { useLimiter } from "../../../services";
import { ControlType } from "../types/types";
import { useActions } from "../utilities/ActionHandler";
import { useEditor } from "../../EditMode";
import { Matrix4, Quaternion, Vector3 } from "three";
import { Text } from "@react-three/drei";

type MoveProps = {
  setActive: Dispatch<SetStateAction<ControlType>>;
  active: string | null;
} & GroupProps;

export function Rotate(props: MoveProps) {
  const { active, setActive, ...restProps } = props;
  const [hover, setHover] = useState<boolean>(false);
  const [hoverAxis, setHoverAxis] = useState<string>("");
  const [activeAxis, setActiveAxis] = useState<string>("");
  const actionRecorded = useRef<boolean>(false);
  const { camera } = useThree();
  const objectRot = useRef<Vector3>(new Vector3());
  const initRot = useRef<Vector3 | null>(new Vector3());
  const cameraRot = useRef(new Vector3());
  const { editObject, editor, mouseDown, intersection } = useEditor();
  const actions = useActions();
  const vecLength = 5;

  const { color, colorX, colorY, colorZ, scale } = useSpring({
    color: hover
      ? "rgba(150, 150, 150, 1)"
      : active === "rotation"
      ? "rgba(0, 150, 0, 1)"
      : "rgba(0, 0, 0, 1)",
    colorX:
      hoverAxis === "x"
        ? "rgba(150, 150, 150, 1)"
        : activeAxis === "x"
        ? "rgba(0, 150, 0, 1)"
        : "rgba(255, 0, 0, 1)",
    colorY:
      hoverAxis === "y"
        ? "rgba(150, 150, 150, 1)"
        : activeAxis === "y"
        ? "rgba(0, 150, 0, 1)"
        : "rgba(255, 255, 0, 1)",
    colorZ:
      hoverAxis === "z"
        ? "rgba(150, 150, 150, 1)"
        : activeAxis === "z"
        ? "rgba(0, 150, 0, 1)"
        : "rgba(0, 0, 255, 1)",
    scale: active === "rotation" ? 0.1 : 0,
    config: {
      mass: 1,
    },
  });

  const limiter = useLimiter(45);
  useFrame(({ clock }, delta) => {
    if (!limiter.isReady(clock) || active !== "rotation" || !editObject) return;

    if (
      mouseDown === editObject.name &&
      editObject.name !== "Editor" &&
      intersection &&
      editor &&
      // @ts-ignore
      editor.scale.x > 15
    ) {
      if (!actionRecorded.current) {
        const rotVec = new Vector3();
        editObject.getWorldDirection(rotVec);
        actions.add({
          target: editObject,
          attribute: "rotation",
          value: rotVec,
        });
        actionRecorded.current = true;
        objectRot.current = new Vector3(
          editObject.rotation.x,
          editObject.rotation.y,
          editObject.rotation.z
        );
        cameraRot.current = new Vector3(
          camera.rotation.x,
          camera.rotation.y,
          camera.rotation.z
        );
      }

      switch (activeAxis) {
        case "x":
          editObject.rotation.x =
            objectRot.current.x + camera.rotation.x - cameraRot.current.x;
          break;
        case "y":
          editObject.rotation.y =
            objectRot.current.y + camera.rotation.y - cameraRot.current.y;
          break;
        case "z":
          editObject.rotation.z =
            objectRot.current.z + camera.rotation.z - cameraRot.current.z;
          break;
        default:
          break;
      }
    } else {
      if (actionRecorded.current) {
        actionRecorded.current = false;
      }
    }
  });

  useEffect(() => {
    if (active !== "rotation") {
      setActiveAxis("");
    }
  }, [active]);

  return (
    <group position-z={0.05} {...restProps}>
      <mesh>
        <boxBufferGeometry args={[0.17, 0.17, 0.05]} />
        <animated.meshBasicMaterial color={color} />
      </mesh>
      <Interactable
        onHover={() => {
          if (active !== "rotation") {
            setHover(true);
          }
        }}
        onUnHover={() => {
          setHover(false);
        }}
        onClick={() => {
          if (active !== "rotation") {
            setActive("rotation");
            setHover(false);
          } else {
            setActive(null);
          }
        }}
      >
        <mesh position-z={0.02}>
          <boxBufferGeometry args={[0.15, 0.15, 0.05]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </Interactable>
      <animated.group name="axisControl" scale={scale} position-y={0.225}>
        <Interactable
          onHover={() => {
            if (activeAxis !== "x") {
              setHoverAxis("x");
            }
          }}
          onUnHover={() => {
            setHoverAxis("");
          }}
          onClick={() => {
            if (activeAxis !== "x") {
              setActiveAxis("x");
              setHoverAxis("");
            } else {
              setActiveAxis("");
            }
          }}
        >
          <group position-x={-2}>
            <mesh>
              <boxBufferGeometry args={[1, 1, 0.25]} />
              <animated.meshBasicMaterial color={colorX} />
            </mesh>
            <mesh position-z={0.1}>
              <boxBufferGeometry args={[0.85, 0.85, 0.25]} />
              <meshBasicMaterial color="white" />
            </mesh>
            <Text fontSize={0.5} position-z={0.25} color="red">
              X
            </Text>
          </group>
        </Interactable>
        <Interactable
          onHover={() => {
            if (activeAxis !== "y") {
              setHoverAxis("y");
            }
          }}
          onUnHover={() => {
            setHoverAxis("");
          }}
          onClick={() => {
            if (activeAxis !== "y") {
              setActiveAxis("y");
              setHoverAxis("");
            } else {
              setActiveAxis("");
            }
          }}
        >
          <group>
            <mesh>
              <boxBufferGeometry args={[1, 1, 0.25]} />
              <animated.meshBasicMaterial color={colorY} />
            </mesh>
            <mesh position-z={0.1}>
              <boxBufferGeometry args={[0.85, 0.85, 0.25]} />
              <meshBasicMaterial color="white" />
            </mesh>
            <Text fontSize={0.5} position-z={0.25} color="yellow">
              Y
            </Text>
          </group>
        </Interactable>
        <Interactable
          onHover={() => {
            if (activeAxis !== "z") {
              setHoverAxis("z");
            }
          }}
          onUnHover={() => {
            setHoverAxis("");
          }}
          onClick={() => {
            if (activeAxis !== "z") {
              setActiveAxis("z");
              setHoverAxis("");
            } else {
              setActiveAxis("");
            }
          }}
        >
          <group position-x={2}>
            <mesh>
              <boxBufferGeometry args={[1, 1, 0.25]} />
              <animated.meshBasicMaterial color={colorZ} />
            </mesh>
            <mesh position-z={0.1}>
              <boxBufferGeometry args={[0.85, 0.85, 0.25]} />
              <meshBasicMaterial color="white" />
            </mesh>
            <Text fontSize={0.5} position-z={0.25} color="blue">
              Z
            </Text>
          </group>
        </Interactable>
      </animated.group>
    </group>
  );
}
