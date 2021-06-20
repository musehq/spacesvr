import { Object3D, Vector3 } from "three";

export type ControlType = null | "position" | "rotation" | "scale" | "color";
export type Action = {
  target: Object3D;
  attribute: string;
  value: any;
};
export type Editor = {
  editObject: Object3D | undefined;
  editor: Object3D | undefined;
  mouseDown: boolean;
  intersect?: Vector3 | undefined;
};
