import { GroupProps } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { useTransition } from "@react-spring/core";
import { a, useSpring } from "@react-spring/three";
import { Option } from "./Option";
import { Image } from "../../../ideas/media/Image";
import useTilg from "tilg";

type Item = { text: string; value: string };

type DropDownProps = {
  items: Item[];
  value?: string;
  width?: number;
  onChange?: (item: Item) => void;
} & GroupProps;

export function DropDown(props: DropDownProps) {
  const { value, items, onChange, width = 1, ...rest } = props;

  const [reset, setReset] = useState(false);
  const [open, setOpen] = useState(false);
  const [localIndex, setLocalIndex] = useState(0);

  const val: Item | undefined =
    items.find((it) => it.value == value) ?? items[localIndex];
  const setVal = (value: string) => {
    const ind = items.findIndex((it) => it.value == value);
    if (ind === -1) return;
    if (onChange) onChange(items[ind]);
    setLocalIndex(ind);
  };

  // keep local index up to date with incoming value
  useEffect(() => {
    if (!val) return;
    const ind = items.findIndex((item) => item.value === val?.value);
    if (ind === -1 || localIndex === ind) return;
    setLocalIndex(ind);
  }, [items, localIndex, val]);

  const arr = open
    ? [...items].sort((x, y) => (x == val ? -1 : y == val ? 1 : 0))
    : val
    ? [val]
    : [];

  const transition = useTransition(arr, {
    keys: (item) => item.value,
    trail: 300 / items.length,
    from: { scale: 0, y: 0 },
    enter: (a, i) => ({ scale: 1, y: -0.05 * i }),
    update: (a, i) => ({ scale: 1, y: -0.05 * i }),
    leave: { scale: 0, y: 0 },
    reset: reset,
    onRest: () => setReset(false),
  });

  const { rot, posZ } = useSpring({
    rot: open ? Math.PI : 0,
    posZ: open ? 0.025 : 0,
  });

  const onClick = (value: string) => {
    if (open) {
      setVal(value);
      setReset(true);
    }
    setOpen(!open);
  };

  return (
    <group name="spacesvr-dropdown" {...rest}>
      <a.group position-z={posZ}>
        {transition(({ scale, y }, it, t, index) => (
          <a.group scale={scale} position-y={y}>
            <Option
              onClick={() => onClick(it.value)}
              width={width}
              index={index}
            >
              {it.text}
            </Option>
          </a.group>
        ))}
        {items.length > 1 && (
          <a.group
            rotation-z={rot}
            position-x={width / 2 - 0.03 / 2 - 0.01}
            position-z={0.01 / 2 + 0.001}
          >
            <Image src="/chevron-down.png" scale={0.03} />
          </a.group>
        )}
      </a.group>
    </group>
  );
}
