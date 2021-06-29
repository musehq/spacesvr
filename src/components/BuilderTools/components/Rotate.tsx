import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { GroupProps, useFrame, useThree } from "@react-three/fiber";
import { animated, useSpring } from "react-spring/three";
import { Interactable } from "../../../modifiers";
import { useLimiter } from "../../../services";
import { ControlType, GLTFResult } from "../types/types";
import { useActions } from "../utilities/ActionHandler";
import { useEditor } from "../../EditMode";
import { Matrix4, MeshBasicMaterial, Quaternion, Vector3 } from "three";
import { Text, useGLTF } from "@react-three/drei";
import { COLORS, HOTBAR_SCALE, FILE_URL } from "../constants/constants";

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
  const cameraRot = useRef(new Vector3());
  const { editObject, editor, mouseDown, intersection } = useEditor();
  const actions = useActions();
  const { nodes, materials } = useGLTF(FILE_URL) as GLTFResult;
  const rotateMat = new MeshBasicMaterial({ color: COLORS.btnPrimary });

  const { color, colorX, colorY, colorZ, scale, posZ } = useSpring({
    color:
      active === "rotation"
        ? COLORS.btnSelected
        : hover
        ? COLORS.btnHovered
        : COLORS.btnSecondary,
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
    posZ: active === "rotation" ? 0.15 : 0,
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
        actionRecorded.current = true;
        objectRot.current = new Vector3(
          editObject.rotation.x,
          editObject.rotation.y,
          editObject.rotation.z
        );
        actions.add({
          target: editObject,
          attribute: "rotation",
          value: objectRot.current,
        });
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
    <group {...restProps}>
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
        <group scale={HOTBAR_SCALE} {...props} dispose={null} name="rotate-btn">
          <animated.group position-z={posZ}>
            <mesh
              name="rotate"
              geometry={nodes.rotate.geometry}
              material={rotateMat}
            />
          </animated.group>
          <mesh name="rotate-click" geometry={nodes["rotate-click"].geometry}>
            <animated.meshBasicMaterial color={color} />
          </mesh>
          <Text
            position={[-0.05, -0.33, 0.075]}
            fontSize={0.2}
            color={COLORS.textPrimary}
            textAlign="center"
            name="rotate-btn-label"
          >
            Rotate
          </Text>
        </group>
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
useGLTF.preload(FILE_URL);
