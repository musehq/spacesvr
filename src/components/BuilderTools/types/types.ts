import { Matrix4, Object3D, Vector3 } from "three";
import { ReactNode } from "react";

export type ControlType = null | "position" | "rotation" | "scale" | "color";
export type Action = {
  target: Object3D;
  matrix: Matrix4;
};
export type Editor = {
  editObject: Object3D | undefined;
  editor: Object3D | undefined;
  mouseDown: string;
  intersection: Vector3 | null;
  displayObject?: ReactNode;
};
