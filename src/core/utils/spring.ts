import { AnimatedValue } from "react-spring";

export const getSpringValues = (spring: AnimatedValue<any>, key?: string) => {
  const arr = [];
  const keys = Object.keys(spring);
  const vals = spring[key || keys[0]];
  for (let i = 0; i < vals.payload.length; i++) {
    arr.push(vals.payload[i].value);
  }
  return arr;
};
