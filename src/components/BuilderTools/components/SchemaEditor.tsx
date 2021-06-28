import { Text } from "@react-three/drei";
import { TextInput } from "../../TextInput";
import { useEditor } from "../../EditMode";
import { useActions } from "../utilities/ActionHandler";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Interactable } from "../../../modifiers";
import { Vector3 } from "three";
import { GroupProps, useThree } from "@react-three/fiber";
import { FacePlayer } from "../../../modifiers/FacePlayer";
import { FileInput } from "../../FileInput";
import { animated, useSpring } from "@react-spring/three";
import { ControlType } from "../types/types";

type SchemaProps = {
  active: string | null;
} & GroupProps;

export function SchemaEditor(props: SchemaProps) {
  const { active } = props;
  const [open, setOpen] = useState<boolean>(true);
  const [toggle, setToggle] = useState<boolean>(false);
  const { editObject, editor, mouseDown, intersection } = useEditor();
  const actions = useActions();
  const { camera } = useThree();
  const [value, setValue] = useState<string>(""),
    [enabled, setEnabled] = useState<boolean>(false);
  const position = useRef<Vector3>(new Vector3(0, 0, 0));
  const { scale, toggleScale } = useSpring({
    scale: open ? 1 : 0,
    toggleScale: toggle ? 1 : 0,
    config: {
      mass: 1,
    },
  });

  useEffect(() => {
    if (active === "rotation" || open) {
      setToggle(false);
    } else if (toggle === false) {
      setToggle(true);
    }
  }, [active]);

  return (
    <group name="premaPanel">
      <animated.group
        position={[0, 0.6, 0]}
        rotation-x={0.25}
        name="panel"
        scale={scale}
      >
        <mesh>
          <boxBufferGeometry args={[1, 0.75, 0.1]} />
          <meshBasicMaterial color="white" opacity={0.75} transparent />
        </mesh>
        {/*<TextInput*/}
        {/*  value={value}*/}
        {/*  setValue={setValue}*/}
        {/*  // enabled={true}*/}
        {/*  position={[0.1, 0.15, 0.05]}*/}
        {/*  inputType="text"*/}
        {/*/>*/}
        {/*<Interactable*/}
        {/*  onClick={() => {*/}
        {/*    if (!enabled) {*/}
        {/*      setEnabled(true)*/}
        {/*    }*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <FacePlayer>*/}
        {/*    <TextInput*/}
        {/*      value={value}*/}
        {/*      setValue={setValue}*/}
        {/*      enabled={true}*/}
        {/*      position-y={0.5}*/}
        {/*      inputType="text"*/}
        {/*    />*/}
        {/*    <FileInput*/}
        {/*      value={value}*/}
        {/*      setValue={setValue}*/}
        {/*      enabled={true}*/}
        {/*      position-y={0.5}*/}
        {/*    />*/}
        {/*  </FacePlayer>*/}
        {/*</Interactable>*/}
        <Interactable
          onClick={() => {
            setOpen(false);
            setToggle(true);
          }}
        >
          <group
            position={[0.325, -0.25, 0]}
            scale={0.1}
            name="premaPanelClose"
          >
            <mesh position-z={0.5}>
              <boxBufferGeometry args={[2, 1, 0.1]} />
              <meshBasicMaterial color="white" />
            </mesh>
            <Text fontSize={0.5} color="black" position={[-0.1, -0.05, 0.75]}>
              Close
            </Text>
          </group>
        </Interactable>
      </animated.group>
      <Interactable
        onClick={() => {
          setOpen(true);
          setToggle(false);
        }}
      >
        <animated.group
          position={[0, 0.2, 0.1]}
          scale={toggleScale}
          name="togglePremaPanel"
        >
          <group scale={[3, 1, 1]}>
            <mesh>
              <boxBufferGeometry args={[0.075, 0.08, 0.01]} />
              <meshBasicMaterial color="black" />
            </mesh>
            <mesh>
              <boxBufferGeometry args={[0.07, 0.07, 0.015]} />
              <meshBasicMaterial color="white" />
            </mesh>
          </group>
        </animated.group>
      </Interactable>
    </group>
  );
}
